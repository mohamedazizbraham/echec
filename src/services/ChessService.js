export class ChessService {
    constructor() {
        this.board = [];
        this.moveHistory = [];
        this.pieces = {
            'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
            'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
        };
    }

    // Initialiser le plateau
    initializeBoard() {
        this.board = [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ];
        this.moveHistory = [];
    }

    // Obtenir le plateau
    getBoard() {
        return this.board;
    }

    // Obtenir une pièce à une position donnée
    getPieceAt(row, col) {
        return this.board[row][col];
    }

    // Déplacer une pièce
    movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const capturedPiece = this.board[toRow][toCol];

        // Enregistrer le mouvement dans l'historique
        this.moveHistory.push({
            piece: piece,
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol },
            captured: capturedPiece || null,
            timestamp: new Date().toLocaleTimeString()
        });

        // Effectuer le déplacement
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = '';
    }

    // Obtenir toutes les pièces sur le plateau avec leur position
    getAllPieces() {
        const pieces = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece) {
                    pieces.push({
                        type: piece,
                        row: row,
                        col: col
                    });
                }
            }
        }
        return pieces;
    }

    // Obtenir l'historique des déplacements
    getMoveHistory() {
        return this.moveHistory;
    }

    // Obtenir le symbole d'une pièce
    getPieceSymbol(piece) {
        return piece ? this.pieces[piece] : '';
    }

    // Réinitialiser le jeu
    reset() {
        this.initializeBoard();
    }
}