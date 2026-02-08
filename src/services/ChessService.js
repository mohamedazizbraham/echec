import { Chess } from "chess.js";

export class ChessService {
    constructor() {
        this.board = [];
        this.moveHistory = [];

        // affichage unicode (tu gardes ton mapping)
        this.pieces = {
            r: "♜",
            n: "♞",
            b: "♝",
            q: "♛",
            k: "♚",
            p: "♟",
            R: "♖",
            N: "♘",
            B: "♗",
            Q: "♕",
            K: "♔",
            P: "♙",
        };

        // ✅ moteur d’échecs (règles)
        this.game = new Chess();

        // ✅ initialisation
        this.initializeBoard();
    }

    // =========================
    // Utils: conversions coord <-> cases (a1..h8)
    // =========================
    _colToFile(col) {
        return "abcdefgh"[col];
    }

    _rowToRank(row) {
        // row 0 = rangée 8, row 7 = rangée 1 (comme ton tableau actuel)
        return String(8 - row);
    }

    _toSquare(row, col) {
        return `${this._colToFile(col)}${this._rowToRank(row)}`;
    }

    _fromGameBoardToMatrix() {
        // chess.js: board()[0] = rangée 8 -> parfait pour ton mapping
        const gb = this.game.board(); // 8x8, objets {type,color} ou null

        this.board = gb.map((rankArr) =>
            rankArr.map((cell) => {
                if (!cell) return "";
                // cell.type: p,r,n,b,q,k ; cell.color: w/b
                const letter = cell.type;
                return cell.color === "w" ? letter.toUpperCase() : letter;
            })
        );
    }

    // =========================
    // Initialiser / reset
    // =========================
    initializeBoard() {
        this.game.reset();
        this._fromGameBoardToMatrix();
        this.moveHistory = [];
    }

    reset() {
        this.initializeBoard();
    }

    // =========================
    // Plateau
    // =========================
    getBoard() {
        return this.board;
    }

    getPieceAt(row, col) {
        if (!this.board[row]) return null;
        return this.board[row][col]; // '' si vide
    }

    // =========================
    // Déplacement (VALIDÉ par chess.js)
    // =========================
    movePiece(fromRow, fromCol, toRow, toCol) {
        if (!this.board[fromRow] || !this.board[toRow]) return false;

        const piece = this.board[fromRow][fromCol];
        if (!piece) return false;

        const from = this._toSquare(fromRow, fromCol);
        const to = this._toSquare(toRow, toCol);

        // tentative via chess.js => null si coup illégal
        const move = this.game.move({ from, to, promotion: "q" });
        if (!move) {
            return false; // ❌ coup refusé
        }

        // pièce capturée (si besoin)
        let capturedPiece = null;
        if (move.captured) {
            const capturedColor = move.color === "w" ? "b" : "w";
            capturedPiece = capturedColor === "w" ? move.captured.toUpperCase() : move.captured;
        }

        // historique (même format que toi + SAN utile)
        this.moveHistory.push({
            piece: move.color === "w" ? move.piece.toUpperCase() : move.piece,
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol },
            captured: capturedPiece,
            san: move.san, // ex: "e4", "Nf3", "exd5", "O-O"
            timestamp: new Date().toLocaleTimeString(),
        });

        // sync matrice d’affichage
        this._fromGameBoardToMatrix();
        return true; // ✅ coup OK
    }

    // =========================
    // BONUS (utile pour surligner les coups possibles)
    // =========================
    getLegalMovesFrom(row, col) {
        const from = this._toSquare(row, col);

        // moves verbose pour récupérer "to"
        return this.game.moves({ square: from, verbose: true }).map((m) => {
            // m.to = "e4" => re-transformer en row/col si tu veux
            const file = m.to[0];
            const rank = parseInt(m.to[1], 10);

            const toCol = "abcdefgh".indexOf(file);
            const toRow = 8 - rank;

            return { row: toRow, col: toCol, to: m.to };
        });
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
                    pieces.push({ type: piece, row, col });
                }
            }
        }
        return pieces;
    }

    getPieceSymbol(piece) {
        return piece ? this.pieces[piece] : "";
    }

    // =========================
    // Historique
    // =========================
    getMoveHistory() {
        return this.moveHistory;
    }

    // =========================
    // Infos (optionnel)
    // =========================
    getFen() {
        return this.game.fen();
    }

    getTurn() {
        return this.game.turn(); // 'w' ou 'b'
    }
}
