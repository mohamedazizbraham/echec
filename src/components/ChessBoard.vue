<template>
  <div class="chess-container">
    <div class="chess-board">
      <div
          v-for="(row, rowIndex) in board"
          :key="rowIndex"
      >
        <div
            v-for="(piece, colIndex) in row"
            :key="`${rowIndex}-${colIndex}`"
            :class="[
            'square',
            isSquareLight(rowIndex, colIndex) ? 'light' : 'dark',
            isSelected(rowIndex, colIndex) ? 'selected' : ''
          ]"
            @click="handleSquareClick(rowIndex, colIndex)"
        >
          {{ getPieceSymbol(piece) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChessBoard',
  props: {
    board: {
      type: Array,
      required: true
    },
    selectedSquare: {
      type: Array,
      default: null
    }
  },
  emits: ['square-click'],
  methods: {
    getPieceSymbol(piece) {
      const pieces = {
        'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
        'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
      };
      return piece ? pieces[piece] : '';
    },
    isSquareLight(row, col) {
      return (row + col) % 2 === 0;
    },
    isSelected(row, col) {
      return this.selectedSquare &&
          this.selectedSquare[0] === row &&
          this.selectedSquare[1] === col;
    },
    handleSquareClick(row, col) {
      this.$emit('square-click', row, col);
    }
  }
};
</script>

<style scoped>
.chess-container {
  background: #92400e;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  display: inline-block;
}

.chess-board {
  display: grid;
  grid-template-columns: repeat(8, 70px);
  grid-template-rows: repeat(8, 70px);
  border: 4px solid #451a03;
}

.square {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.square:hover {
  filter: brightness(1.1);
}

.square.light {
  background-color: #fef3c7;
}

.square.dark {
  background-color: #b45309;
}

.square.selected {
  box-shadow: inset 0 0 0 4px #fbbf24;
}
</style>