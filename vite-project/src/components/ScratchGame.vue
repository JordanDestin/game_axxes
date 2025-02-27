<template>
    <div class="scratch-game">
      <!-- Bouton de retour à l'écran de login -->
      <div class="header-buttons">
        <button @click="logout" class="logout-btn">
          Changer de pseudo
        </button>
      </div>  
      <div v-if="showResult" class="result-overlay">
        <div class="result-box" :class="{ 'win': isWin, 'lose': !isWin }">
          <div class="close-button" @click="closeResult">X</div>
          <h3 v-if="isWin">Félicitation !</h3>
          <h3 v-else>Dommage, c'est perdu pour cette fois.</h3>
          
          <div class="emoji">
            <img v-if="isWin" src="../assets/smiley.png" alt="emoji" />
            <img v-else="isWin" src="../assets/white_frowning_face.png" alt="emoji" />
          </div>
          <p v-if="isWin">Vous avez gagné un billet d'avion.</p>
          <p v-if="isWin">Vous pourrez rejouer dans 24 heures.</p>
          <p v-else>Vous pouvez retenter votre chance dès maintenant.</p>
        </div>
      </div>  
      <!-- Afficher un message si le joueur doit attendre -->
      <div v-if="mustWait" class="wait-message">
        <h3>Vous avez déjà gagné récemment!</h3>
        <p>Vous pourrez rejouer dans: {{ formatTimeRemaining }}</p>
      </div>
      <div v-else>
        <h3>Grattez 3 ballons...</h3>
        <p class="instructions">Si vous découvrez 3 cadeaux de couleur identique, c'est gagné.</p>        
        <div class="game-grid">
          <div 
            v-for="(card, index) in cards" 
            :key="index"
            class="card"
            @click="scratch(index)"
          >
            <img 
              v-if="!card.revealed" 
              src="../assets/ballon.png" 
              alt="Ballon de football" 
              class="card-image"
            />
            <img 
              v-else-if="card.type === 'cadeau-bleu'" 
              src="../assets/cadeau_bleu.png" 
              alt="Cadeau bleu" 
              class="card-image"
            />
            <img 
              v-else-if="card.type === 'cadeau-vert'" 
              src="../assets/cadeau_vert.png" 
              alt="Cadeau vert" 
              class="card-image"
            />
            <img 
              v-else-if="card.type === 'cadeau-rouge'" 
              src="../assets/cadeau_rouge.png" 
              alt="Cadeau rouge" 
              class="card-image"
            />  
            <!-- Overlay pour désactiver les cartes déjà grattées ou quand 3 ont été grattées -->
            <div v-if="card.revealed || scratchedCount >= 3" class="card-overlay"></div>
          </div>
        </div>        
        <button 
          v-if="scratchedCount >= 3" 
          @click="resetGame" 
          class="play-again"
        >
          Jouer à nouveau
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useStore } from '../store';
  
  const emit = defineEmits(['game-completed', 'logout']);
  const store = useStore();
  
  // Types de cadeaux
  const cardTypes = ['cadeau-bleu', 'cadeau-vert', 'cadeau-rouge'];
  const cards = ref([]);
  const scratchedCount = ref(0);
  const showResult = ref(false);
  const isWin = ref(false);
  
  // Gestion du temps d'attente
  const mustWait = ref(false);
  const waitUntil = ref(null);
  const timeRemaining = ref(0);
  let timerInterval = null;
  
  // Calculer le temps restant formaté (heures:minutes:secondes)
  const formatTimeRemaining = computed(() => {
    const hours = Math.floor(timeRemaining.value / 3600);
    const minutes = Math.floor((timeRemaining.value % 3600) / 60);
    const seconds = timeRemaining.value % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  });
  
  // Méthode pour déterminer si le joueur gagne
  const determineWin = () => {
    // Gagner précisément à la 3ème participation
    return store.participationCount === 2; // Indice 2 = 3ème participation (0, 1, 2)
  };
  
  // Vérifier si le joueur doit attendre
  const checkWaitStatus = () => {
    // Récupérer le timestamp de la dernière victoire
    const lastWinTimestamp = localStorage.getItem(`lastWin_${store.username}`);
    
    if (lastWinTimestamp) {
      const waitUntilTime = parseInt(lastWinTimestamp) + (24 * 60 * 60 * 1000); // +24h en millisecondes
      const currentTime = Date.now();
      
      if (currentTime < waitUntilTime) {
        // Le joueur doit encore attendre
        mustWait.value = true;
        waitUntil.value = waitUntilTime;
        
        // Calculer le temps restant initial
        timeRemaining.value = Math.floor((waitUntilTime - currentTime) / 1000);
        
        // Démarrer un timer pour mettre à jour le compteur
        startTimer();
      } else {
        // Le délai d'attente est écoulé
        mustWait.value = false;
        stopTimer();
      }
    } else {
      // Aucune victoire enregistrée, pas besoin d'attendre
      mustWait.value = false;
    }
  };
  
  // Démarrer le timer pour mettre à jour le compteur
  const startTimer = () => {
    stopTimer(); // S'assurer qu'il n'y a pas de timer existant
    
    timerInterval = setInterval(() => {
      if (timeRemaining.value > 0) {
        timeRemaining.value--;
      } else {
        // Le délai est écoulé
        mustWait.value = false;
        stopTimer();
      }
    }, 1000);
  };
  
  // Arrêter le timer
  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  };
  
  // Fonction pour se déconnecter et revenir à l'écran de login
  const logout = () => {
    // Arrêter le timer si actif
    stopTimer();
    
    // Informer le composant parent qu'on souhaite retourner à l'écran de login
    emit('logout');
    
    // Déconnecter l'utilisateur dans le store
    store.logout();
  };
  
  const setupGame = () => {
    // Vérifier d'abord si le joueur doit attendre
    checkWaitStatus();
    
    // Si le joueur doit attendre, ne pas initialiser le jeu
    if (mustWait.value) {
      return;
    }
    
    // Créer un tableau de 9 cartes
    cards.value = Array(9).fill().map(() => ({
      type: '', // Type sera défini ci-dessous
      revealed: false
    }));
    
    // Si c'est une partie gagnante (exactement la 3ème participation)
    if (determineWin()) {
      // Choisir un type de cadeau gagnant aléatoire pour toutes les cartes
      const winningType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
 
      // Mettre le même type sur toutes les cartes pour garantir la victoire
      for (let i = 0; i < 9; i++) {
        cards.value[i].type = winningType;
      }
    } else {     
      // Distribution aléatoire des types sans possibilité de gagner
      // S'assurer qu'aucun type de cadeau n'apparaît plus de 2 fois
      
      // Créer un tableau pour suivre combien de chaque type est utilisé
      const typeCounts = {};
      cardTypes.forEach(type => typeCounts[type] = 0);
      
      // Assigner un type à chaque carte
      for (let i = 0; i < 9; i++) {
        let availableTypes = cardTypes.filter(type => typeCounts[type] < 2);
        
        // Si tous les types ont déjà été utilisés 2 fois, réinitialiser
        if (availableTypes.length === 0) {
          cardTypes.forEach(type => typeCounts[type] = 0);
          availableTypes = [...cardTypes];
        }
        
        // Choisir un type aléatoire parmi les disponibles
        const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        cards.value[i].type = randomType;
        typeCounts[randomType]++;
      }
    }
    
    // Afficher les types de cartes pour le débogage
    cards.value.forEach((card, index) => {
      console.log(`Carte ${index}: ${card.type}`);
    });
  };
  
  const scratch = async (index) => {
    // Ignorer si la carte est déjà révélée ou si 3 cartes ont déjà été grattées
    if (scratchedCount.value >= 3 || cards.value[index].revealed) {
      return;
    }
    
    // Révéler la carte
    cards.value[index].revealed = true;
    scratchedCount.value++;
    
    // Vérifier si 3 cartes ont été grattées
    if (scratchedCount.value === 3) {
      // Vérifier si 3 cartes identiques ont été découvertes
      const revealedCards = cards.value.filter(card => card.revealed);
      const types = revealedCards.map(card => card.type);
      
      // Gagner si tous les types révélés sont identiques
      const hasThreeIdentical = types.every(type => type === types[0]);
      
      isWin.value = hasThreeIdentical;
      
      // Enregistrer la participation
      await store.saveParticipation({
        username: store.username,
        isWin: isWin.value,
        date: new Date().toISOString()
      });
      
      // Si c'est une victoire, enregistrer le timestamp pour le délai de 24h
      if (isWin.value) {
        localStorage.setItem(`lastWin_${store.username}`, Date.now().toString());
      }
      
      // Émettre l'événement pour mettre à jour l'historique
      emit('game-completed');
      
      // Afficher le résultat
      setTimeout(() => {
        showResult.value = true;
      }, 500);
    }
  };
  
  const resetGame = () => {
    scratchedCount.value = 0;
    showResult.value = false;
    setupGame();
  };
  
  const closeResult = () => {
    showResult.value = false;
    
    // Vérifier si le joueur doit attendre après avoir fermé le résultat
    if (isWin.value) {
      checkWaitStatus();
    }
  };
  
  onMounted(() => {
    setupGame();
  });
  
  // S'assurer de nettoyer le timer lorsque le composant est détruit
  onUnmounted(() => {
    stopTimer();
  });
  </script>
  
  <style scoped>
  .scratch-game {
    position: relative;
    padding: 20px;
  }
  
  .header-buttons {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
  }
  
  .logout-btn {
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    color: #495057;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
  }
  
  .logout-btn:hover {
    background-color: #e9ecef;
    border-color: #ced4da;
  }
  
  .instructions {
    text-align: center;
    margin-bottom: 20px;
    color: #555;
  }
  
  .game-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .card {
    position: relative;
    aspect-ratio: 1;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    overflow: hidden;
  }
  
  .card-image {
    max-width: 80%;
    max-height: 80%;
    object-fit: contain;
    transition: transform 0.3s;
  }
  
  .card:hover .card-image {
    transform: scale(1.05);
  }
  
  .card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
  }
  
  .play-again {
    display: block;
    margin: 0 auto;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }
  
  .result-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }
  
  .result-box {
    position: relative;
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    text-align: center;
    max-width: 80%;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    cursor: pointer;
    background-color: #f1f1f1;
    border-radius: 50%;
  }
  
  .win h3 {
    color: #4CAF50;
  }
  
  .lose h3 {
    color: #f44336;
  }
  
  .emoji {
    margin: 20px 0;
  }
  
  .emoji img {
    width: 80px;
    height: 80px;
  }
  
  .wait-message {
    text-align: center;
    padding: 30px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin: 20px 0;
  }
  
  .wait-message h3 {
    color: #f44336;
    margin-bottom: 10px;
  }
  
  .wait-message p {
    font-size: 1.2em;
    font-weight: bold;
  }
  </style>