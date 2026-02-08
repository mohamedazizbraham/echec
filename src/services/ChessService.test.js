import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ChessService } from './ChessService.js'

describe('ChessService', () => {
    let service

    beforeEach(() => {
        service = new ChessService()
    })

    it('initialise un plateau 8x8 au démarrage', () => {
        const board = service.getBoard()
        expect(board).toHaveLength(8)
        for (const row of board) {
            expect(row).toHaveLength(8)
        }
    })

    it('place correctement quelques pièces au départ', () => {
        expect(service.getPieceAt(0, 0)).toBe('r') // Tour noire
        expect(service.getPieceAt(0, 4)).toBe('k') // Roi noir
        expect(service.getPieceAt(1, 0)).toBe('p')
        expect(service.getPieceAt(1, 7)).toBe('p')

        expect(service.getPieceAt(6, 0)).toBe('P')
        expect(service.getPieceAt(6, 7)).toBe('P')
        expect(service.getPieceAt(7, 0)).toBe('R') // Tour blanche
    })

    it('getPieceAt retourne null si la ligne est invalide', () => {
        expect(service.getPieceAt(99, 0)).toBeNull()
        expect(service.getPieceAt(-1, 0)).toBeNull()
    })

    it('movePiece déplace une pièce vers une case vide', () => {
        const ok = service.movePiece(6, 0, 5, 0) // a2 -> a3 (coup légal)
        expect(ok).toBe(true)

        expect(service.getPieceAt(6, 0)).toBe('')
        expect(service.getPieceAt(5, 0)).toBe('P')
    })

    it('movePiece capture une pièce si la case cible est occupée (coup légal)', () => {
        // Roi noir e8, roi blanc e1, pion blanc a2, pion noir b3, aux blancs
        service.game.load('4k3/8/8/8/8/1p6/P7/4K3 w - - 0 1')

        const ok = service.movePiece(6, 0, 5, 1) // a2 -> b3
        expect(ok).toBe(true)

        expect(service.getPieceAt(6, 0)).toBe('')
        expect(service.getPieceAt(5, 1)).toBe('P')
    })

    it('movePiece met à jour l’historique des coups', () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2026-01-23T12:00:00Z'))

        const ok = service.movePiece(6, 0, 5, 0)
        expect(ok).toBe(true)

        const history = service.getMoveHistory()
        expect(history).toHaveLength(1)

        const move = history[0]
        expect(move).toMatchObject({
            piece: 'P',
            from: { row: 6, col: 0 },
            to: { row: 5, col: 0 },
            captured: null,
        })
        expect(typeof move.timestamp).toBe('string')
        expect(move.timestamp.length).toBeGreaterThan(0)

        vi.useRealTimers()
    })

    it('getAllPieces retourne une liste de pièces avec positions', () => {
        const pieces = service.getAllPieces()
        expect(pieces.length).toBe(32)
        expect(pieces.some(p => p.type === 'r' && p.row === 0 && p.col === 0)).toBe(true)
    })

    it('reset remet le plateau et vide l’historique', () => {
        const ok = service.movePiece(6, 0, 5, 0)
        expect(ok).toBe(true)
        expect(service.getMoveHistory().length).toBe(1)

        service.reset()

        expect(service.getPieceAt(6, 0)).toBe('P')
        expect(service.getPieceAt(5, 0)).toBe('')
        expect(service.getMoveHistory().length).toBe(0)
    })

    it('movePiece ne fait rien si la case source est vide', () => {
        const beforeBoard = JSON.stringify(service.getBoard())
        const beforeHistoryLen = service.getMoveHistory().length

        const ok = service.movePiece(4, 4, 3, 4) // case vide
        expect(ok).toBe(false)

        expect(JSON.stringify(service.getBoard())).toBe(beforeBoard)
        expect(service.getMoveHistory().length).toBe(beforeHistoryLen)
    })
})
