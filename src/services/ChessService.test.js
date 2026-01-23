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
        // Tour noire en (0,0)
        expect(service.getPieceAt(0, 0)).toBe('r')
        // Roi noir en (0,4)
        expect(service.getPieceAt(0, 4)).toBe('k')
        // Pions noirs ligne 1
        expect(service.getPieceAt(1, 0)).toBe('p')
        expect(service.getPieceAt(1, 7)).toBe('p')

        // Pions blancs ligne 6
        expect(service.getPieceAt(6, 0)).toBe('P')
        expect(service.getPieceAt(6, 7)).toBe('P')
        // Tour blanche en (7,0)
        expect(service.getPieceAt(7, 0)).toBe('R')
    })

    it('getPieceAt retourne null si la ligne est invalide', () => {
        expect(service.getPieceAt(99, 0)).toBeNull()
        expect(service.getPieceAt(-1, 0)).toBeNull()
    })

    it('movePiece déplace une pièce vers une case vide', () => {
        // Déplacer un pion blanc de (6,0) -> (5,0)
        service.movePiece(6, 0, 5, 0)

        expect(service.getPieceAt(6, 0)).toBe('')
        expect(service.getPieceAt(5, 0)).toBe('P')
    })

    it('movePiece capture une pièce si la case cible est occupée', () => {
        // Forcer une capture: pion blanc (6,0) vers (1,0) où il y a un pion noir
        service.movePiece(6, 0, 1, 0)

        expect(service.getPieceAt(6, 0)).toBe('')
        expect(service.getPieceAt(1, 0)).toBe('P') // remplacée par la pièce déplacée
    })

    it('movePiece met à jour l’historique des coups', () => {
        // Stabiliser l’heure (évite les tests instables)
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2026-01-23T12:00:00Z'))

        service.movePiece(6, 0, 5, 0)

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
        // Position initiale : 32 pièces
        expect(pieces.length).toBe(32)

        // Exemple: vérifier qu’il y a bien une pièce en (0,0) de type 'r'
        expect(pieces.some(p => p.type === 'r' && p.row === 0 && p.col === 0)).toBe(true)
    })

    it('reset remet le plateau et vide l’historique', () => {
        service.movePiece(6, 0, 5, 0)
        expect(service.getMoveHistory().length).toBe(1)

        service.reset()

        expect(service.getPieceAt(6, 0)).toBe('P')
        expect(service.getPieceAt(5, 0)).toBe('')
        expect(service.getMoveHistory().length).toBe(0)
    })

    it('movePiece ne fait rien si la case source est vide', () => {
        const beforeBoard = JSON.stringify(service.getBoard())
        const beforeHistoryLen = service.getMoveHistory().length

        // Case vide au départ (ex: 4,4)
        service.movePiece(4, 4, 3, 4)

        expect(JSON.stringify(service.getBoard())).toBe(beforeBoard)
        expect(service.getMoveHistory().length).toBe(beforeHistoryLen)
    })
})
