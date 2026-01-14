<template>
  <div class="info-section">
    <h2>📜 Historique des déplacements</h2>
    <div class="history-list">
      <div v-if="history.length === 0" class="no-history">
        Aucun déplacement effectué
      </div>
      <div
          v-else
          v-for="(move, index) in history"
          :key="index"
          class="history-item"
      >
        <span class="move-number">{{ index + 1 }}.</span>
        {{ getPieceSymbol(move.piece) }} {{ getPieceName(move.piece) }}
        : {{ getSquareNotation(move.from.row, move.from.col) }}
        → {{ getSquareNotation(move.to.row, move.to.col) }}
        <span v-if="move.captured"> (capture {{ getPieceSymbol(move.captured) }})</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MoveHistory',
  props: {
    history: {
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

.history-list {
  max-height: 400px;
  overflow-y: auto;
  font-size: 0.9rem;
}

.history-item {
  padding: 8px;
  margin-bottom: 5px;
  background: #e0f2fe;
  border-radius: 5px;
  border-left: 3px solid #0284c7;
}

.move-number {
  font-weight: bold;
  color: #0284c7;
  margin-right: 8px;
}

.no-history {
  color: #64748b;
  font-style: italic;
  text-align: center;
  padding: 20px;
}
</style>