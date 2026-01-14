<template>
  <div class="info-section">
    <h2>📍 Position des pièces</h2>
    <div class="piece-list">
      <div
          v-for="piece in pieces"
          :key="`${piece.row}-${piece.col}`"
          class="piece-item"
      >
        <div>
          <span class="piece-symbol">{{ getPieceSymbol(piece.type) }}</span>
          <strong>{{ getPieceName(piece.type) }}</strong>
        </div>
        <span>{{ getSquareNotation(piece.row, piece.col) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PieceList',
  props: {
    pieces: {
      type: Array,
      required: true
    }
  },
  methods: {
    getPieceSymbol(piece) {
      const pieces = {
        'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
        'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
      };
      return pieces[piece] || '';
    },
    getPieceName(piece) {
      const names = {
        'r': 'Tour noire', 'n': 'Cavalier noir', 'b': 'Fou noir',
        'q': 'Dame noire', 'k': 'Roi noir', 'p': 'Pion noir',
        'R': 'Tour blanche', 'N': 'Cavalier blanc', 'B': 'Fou blanc',
        'Q': 'Dame blanche', 'K': 'Roi blanc', 'P': 'Pion blanc'
      };
      return names[piece] || '';
    },
    getSquareNotation(row, col) {
      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
      return files[col] + ranks[row];
    }
  }
};
</script>

<style scoped>
.info-section {
  margin-bottom: 25px;
}

.info-section h2 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #1e293b;
  border-bottom: 2px solid #d97706;
  padding-bottom: 8px;
}

.piece-list {
  max-height: 300px;
  overflow-y: auto;
  font-size: 0.9rem;
}

.piece-item {
  padding: 8px;
  margin-bottom: 5px;
  background: #f1f5f9;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.piece-symbol {
  font-size: 1.5rem;
  margin-right: 10px;
}
</style>