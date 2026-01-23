export class ChessService {
    constructor() {
        this.board = [];
        this.moveHistory = [];
        this.pieces = {
            'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
            'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
        };

        // ✅ Initialisation immédiate pour éviter les erreurs au render
        this.initializeBoard();
    }

    // =========================
    // Initialiser le plateau
    // =========================
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

    // =========================
    // Plateau
    // =========================
    getBoard() {
        return this.board;
    }

    getPieceAt(row, col) {
        if (!this.board[row]) return null;
        return this.board[row][col];
    }

    // =========================
    // Déplacement
    // =========================
    movePiece(fromRow, fromCol, toRow, toCol) {
        if (!this.board[fromRow] || !this.board[toRow]) return;

        const piece = this.board[fromRow][fromCol];
        if (!piece) return;

        const capturedPiece = this.board[toRow][toCol];

        this.moveHistory.push({
            piece,
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol },
            captured: capturedPiece || null,
            timestamp: new Date().toLocaleTimeString()
        });

        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = '';
    }

    // =========================
    // Pièces
    // =========================
    getAllPieces() {
        const pieces = [];

        if (!Array.isArray(this.board) || this.board.length !== 8) {
            return pieces;
        }

        for (let row = 0; row < 8; row++) {
            if (!Array.isArray(this.board[row])) continue;

            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece) {
                    pieces.push({
                        type: piece,
                        row,
                        col
                    });
                }
            }
        }

        return pieces;
    }

    getPieceSymbol(piece) {
        return piece ? this.pieces[piece] : '';
    }

    // =========================
    // Historique
    // =========================
    getMoveHistory() {
        return this.moveHistory;
    }

    // =========================
    // Reset
    // =========================
    reset() {
        this.initializeBoard();
    }
}
