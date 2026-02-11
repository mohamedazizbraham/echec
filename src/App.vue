<template>
  <div id="app">
    <h1>♟️ Plateau d'échecs avec Historique</h1>

    <div class="main-container">
      <div>
        <ChessBoard
            :board="board"
            :selectedSquare="selectedSquare"
            @square-click="handleSquareClick"
        />

        <div class="controls">
          <p class="instruction">
            {{ selectedSquare
              ? '🎯 Cliquez sur une case pour déplacer la pièce'
              : '♟️ Cliquez sur une pièce pour la sélectionner' }}
          </p>

          <div class="buttons">
            <button class="undo-btn" data-testid="undo" @click="undo">
              Annuler
            </button>

            <button class="reset-btn" @click="resetBoard">
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      <div class="info-panel">
        <PieceList :pieces="chessService.getAllPieces()" />
        <MoveHistory :history="chessService.getMoveHistory()" />
      </div>
    </div>
  </div>
</template>

<script>
import ChessBoard from './components/ChessBoard.vue';
import PieceList from './components/PieceList.vue';
import MoveHistory from './components/MoveHistory.vue';
import { ChessService } from './services/ChessService';

export default {
  name: 'App',
  components: {
    ChessBoard,
    PieceList,
    MoveHistory
  },
  data() {
    return {
      chessService: new ChessService(),
      board: [],
      selectedSquare: null
    };
  },
  mounted() {
    this.resetBoard();
  },
  methods: {
    handleSquareClick(row, col) {
      if (this.selectedSquare) {
        const [selectedRow, selectedCol] = this.selectedSquare;
        this.chessService.movePiece(selectedRow, selectedCol, row, col);
        this.board = [...this.chessService.getBoard()];
        this.selectedSquare = null;
      } else if (this.board[row][col]) {
        this.selectedSquare = [row, col];
      }
    },

    undo() {
      const ok = this.chessService.undoLastMove?.();
      // ok peut être false si aucun coup à annuler
      this.board = [...this.chessService.getBoard()];
      this.selectedSquare = null;
      return ok;
    },

    resetBoard() {
      this.chessService.reset();
      this.board = [...this.chessService.getBoard()];
      this.selectedSquare = null;
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  min-height: 100vh;
  padding: 20px;
}

#app {
  max-width: 1400px;
  margin: 0 auto;
}

h1 {
  color: white;
  font-size: 2.5rem;
  margin-bottom: 30px;
  text-align: center;
}

.main-container {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 30px;
  align-items: start;
}

.controls {
  margin-top: 20px;
  text-align: center;
}

.instruction {
  color: white;
  font-size: 1.1rem;
  margin-bottom: 15px;
}

.buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.undo-btn {
  background-color: #0ea5e9;
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.undo-btn:hover {
  background-color: #0284c7;
}

.reset-btn {
  background-color: #d97706;
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.reset-btn:hover {
  background-color: #b45309;
}

.info-panel {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  min-width: 350px;
}

@media (max-width: 1200px) {
  .main-container {
    grid-template-columns: 1fr;
  }
}
</style>
