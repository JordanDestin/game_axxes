<template>
  <div class="container">
    <!-- 1. Zone d'identification -->
    <div v-if="!isLoggedIn" class="login-section">
      <h2>Identifiez-vous</h2>
      <input
        v-model="pseudoInput"
        type="text"
        placeholder="Entrez votre pseudo"
      />
      <button @click="login">Valider</button>
    </div>

    <!-- 2. Jeu de grattage -->
    <div v-else class="game-section">
      <h2>Bonjour, {{ pseudo }} !</h2>
      <p>Grattez 3 cases parmi 9</p>

      <div class="grid">
        <div
          v-for="(square, index) in squares"
          :key="index"
          class="square"
          @click="revealSquare(index)"
        >
          <!-- Affichage conditionnel : "caché" ou la couleur révélée -->
          <span v-if="square.revealed">{{ square.color }}</span>
          <span v-else>?</span>
        </div>
      </div>

      <div class="result" v-if="isGameOver">
        <h3>
          Vous avez
          <span v-if="isWinner" class="win">GAGNÉ</span>
          <span v-else class="lose">PERDU</span>
          !
        </h3>
      </div>

      <!-- 3. Historique des 3 dernières participations -->
      <div class="history" v-if="lastThreeParticipations.length">
        <h3>3 dernières participations :</h3>
        <ul>
          <li v-for="(p, idx) in lastThreeParticipations" :key="idx">
            <strong>{{ p.pseudo }}</strong> - {{ p.result }} - {{ p.date }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Champs pour l'identification
const pseudoInput = ref('')
const pseudo = ref('')

// Données du jeu
const squares = ref([])
const maxScratches = 3
const scratchCount = ref(0)
const isGameOver = ref(false)
const isWinner = ref(false)

// Historique des participations (en mémoire + localStorage)
const participations = ref([])

/**
 * 1. Login
 */
function login() {
  if (pseudoInput.value.trim() !== '') {
    pseudo.value = pseudoInput.value.trim()
    initGame()
  }
}

const isLoggedIn = computed(() => pseudo.value !== '')

/**
 * 2. Initialiser une partie (9 cases à gratter)
 */
function initGame() {
  squares.value = []
  scratchCount.value = 0
  isGameOver.value = false
  isWinner.value = false

  // On génère 9 "cases" avec une couleur aléatoire (Rouge, Vert, Bleu).
  for (let i = 0; i < 9; i++) {
    squares.value.push({
      revealed: false,
      color: randomColor()
    })
  }
}

/**
 * Générer une couleur aléatoire
 */
function randomColor() {
  const colors = ['Bleu', 'Vert', 'Rouge']
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * Révéler une case
 */
function revealSquare(index) {
  if (isGameOver.value) return
  if (squares.value[index].revealed) return // déjà révélée
  if (scratchCount.value >= maxScratches) return // déjà gratté 3 fois

  squares.value[index].revealed = true
  scratchCount.value++

  // Quand on a gratté 3 cases, on vérifie le résultat
  if (scratchCount.value === maxScratches) {
    checkResult()
  }
}

/**
 * Vérifier le résultat
 * -> Gagner UNIQUEMENT lors de la 3ᵉ participation du même pseudo
 * -> Si c'est la 3ᵉ participation, on regarde si les 3 cases sont de la même couleur.
 * -> Sinon, on perd automatiquement.
 */
function checkResult() {
  // Nombre de parties déjà jouées par ce pseudo (avant celle-ci)
  const userPlaysSoFar = participations.value.filter(
    (p) => p.pseudo === pseudo.value
  ).length
  // userPlaysSoFar = 0 => c'est sa 1ʳᵉ partie
  // userPlaysSoFar = 1 => c'est sa 2ᵉ partie
  // userPlaysSoFar = 2 => c'est sa 3ᵉ partie (celle qu'il est en train de terminer)
  // userPlaysSoFar = 3 => c'est sa 4ᵉ partie, etc.

  if (userPlaysSoFar === 2) {
    // => Le joueur termine ici sa 3ᵉ participation
    // On applique la logique des 3 couleurs identiques
    const revealedColors = squares.value
      .filter((s) => s.revealed)
      .map((s) => s.color)

    const colorCount = {}
    for (const color of revealedColors) {
      colorCount[color] = (colorCount[color] || 0) + 1
    }
    // On gagne si on a 3 fois la même couleur
    isWinner.value = Object.values(colorCount).some((count) => count >= 3)
  } else {
    // 1ʳᵉ, 2ᵉ, 4ᵉ participation, etc. => on perd automatiquement
    isWinner.value = false
  }

  isGameOver.value = true
  saveParticipation()
}

/**
 * Sauvegarder la participation (pseudo, résultat, date)
 */
function saveParticipation() {
  const newParticipation = {
    pseudo: pseudo.value,
    result: isWinner.value ? 'Gagné' : 'Perdu',
    date: new Date().toLocaleString()
  }

  participations.value.push(newParticipation)
  localStorage.setItem('participations', JSON.stringify(participations.value))
}

/**
 * Les 3 dernières participations
 */
const lastThreeParticipations = computed(() => {
  return participations.value.slice(-3)
})

/**
 * Charger l'historique depuis le localStorage
 */
onMounted(() => {
  const stored = localStorage.getItem('participations')
  if (stored) {
    participations.value = JSON.parse(stored)
  }
})
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.login-section,
.game-section {
  margin-top: 30px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 80px);
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.square {
  width: 80px;
  height: 80px;
  background: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.2em;
}

.result {
  margin-top: 20px;
}

.win {
  color: green;
}

.lose {
  color: red;
}

.history {
  margin-top: 20px;
  text-align: left;
}
</style>
