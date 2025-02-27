<template>
    <div>
      <!-- Bouton de retour à l'écran de login -->
      <div class="flex justify-end mb-6">
        <button @click="logout" class="flex items-center px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Changer de pseudo
        </button>
      </div>
  
      <!-- Résultat de la partie -->
      <div v-if="showResult" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
        <div class="bg-white rounded-xl w-full max-w-sm p-6 relative shadow-2xl transform transition-all animate-fade-in">
          <button @click="closeResult" class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition">
            &times;
          </button>
          
          <div class="text-center">
            <div v-if="isWin" class="flex flex-col items-center">
              <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-green-600 mb-2">Félicitation !</h3>
              <p class="text-gray-700 mb-1">Vous avez gagné un billet d'avion.</p>
              <p class="text-gray-500">Vous pourrez rejouer dans 24 heures.</p>
            </div>
            
            <div v-else class="flex flex-col items-center">
              <div class="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-red-600 mb-2">Dommage, c'est perdu !</h3>
              <p class="text-gray-700">Vous pouvez retenter votre chance dès maintenant.</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Message d'attente -->
      <div v-if="mustWait" class="bg-blue-50 rounded-xl p-6 shadow-md mb-6">
        <div class="text-center">
          <h3 class="text-xl font-bold text-blue-700 mb-3">Vous avez déjà gagné récemment!</h3>
          <div class="inline-block bg-blue-100 rounded-lg px-4 py-2 font-mono text-xl text-blue-800">
            {{ formatTimeRemaining }}
          </div>
          <p class="mt-3 text-blue-600">Revenez plus tard pour retenter votre chance.</p>
        </div>
      </div>
  
      <!-- Le jeu lui-même -->
      <div v-else>
        <div class="text-center mb-6">
          <h3 class="text-xl font-bold text-gray-800">Grattez 3 ballons...</h3>
          <p class="text-gray-600 mt-1">Si vous découvrez 3 cadeaux de couleur identique, c'est gagné.</p>
        </div>
        
        <div class="grid grid-cols-3 gap-4 md:gap-6">
          <div 
            v-for="(card, index) in cards" 
            :key="index"
            class="aspect-square bg-white rounded-xl shadow-md overflow-hidden relative transform transition-transform duration-200 hover:scale-105 hover:shadow-lg cursor-pointer"
            :class="{ 'cursor-default': card.revealed || scratchedCount >= 3 }"
            @click="scratch(index)"
          >
            <!-- Image -->
            <div class="w-full h-full flex items-center justify-center p-4">
              <img 
                v-if="!card.revealed" 
                src="../assets/ballon.png" 
                alt="Ballon de football" 
                class="max-w-full max-h-full object-contain transition-transform duration-300"
              />
              <img 
                v-else-if="card.type === 'cadeau-bleu'" 
                src="../assets/cadeau_bleu.png" 
                alt="Cadeau bleu" 
                class="max-w-full max-h-full object-contain animate-reveal"
              />
              <img 
                v-else-if="card.type === 'cadeau-vert'" 
                src="../assets/cadeau_vert.png" 
                alt="Cadeau vert" 
                class="max-w-full max-h-full object-contain animate-reveal"
              />
              <img 
                v-else-if="card.type === 'cadeau-rouge'" 
                src="../assets/cadeau_rouge.png" 
                alt="Cadeau rouge" 
                class="max-w-full max-h-full object-contain animate-reveal"
              />
            </div>
  
            <!-- Overlay pour désactiver les cartes -->
            <div 
              v-if="card.revealed || scratchedCount >= 3" 
              class="absolute inset-0 bg-black bg-opacity-5"
            ></div>
          </div>
        </div>
        
        <!-- Bouton rejouer -->
        <div v-if="scratchedCount >= 3" class="mt-8 flex justify-center">
          <button 
            @click="resetGame"
            class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition duration-200"
          >
            Jouer à nouveau
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useGameState } from '../composables/useGameState';
  
  const emit = defineEmits(['game-completed', 'logout']);
  const gameState = useGameState();
  
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
    return gameState.getParticipationCount() === 2; // Indice 2 = 3ème participation (0, 1, 2)
  };
  
  // Vérifier si le joueur doit attendre
  const checkWaitStatus = () => {
    // Récupérer le timestamp de la dernière victoire
    const lastWinTimestamp = localStorage.getItem(`lastWin_${gameState.username.value}`);
    
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
    
    // Déconnecter l'utilisateur
    gameState.logout();
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
    
    console.log("Initialisation du jeu - participationCount:", gameState.getParticipationCount());
    
    // Si c'est une partie gagnante (exactement la 3ème participation)
    if (determineWin()) {
      console.log("Configuration pour la victoire garantie à la 3ème participation");
      
      // Choisir un type de cadeau gagnant aléatoire pour toutes les cartes
      const winningType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
      console.log("Type gagnant choisi pour toutes les cartes:", winningType);
      
      // Mettre le même type sur toutes les cartes pour garantir la victoire
      for (let i = 0; i < 9; i++) {
        cards.value[i].type = winningType;
      }
    } else {
      console.log("Configuration pour une partie non-gagnante");
      
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
      await gameState.saveParticipation({
        username: gameState.username.value,
        isWin: isWin.value,
        date: new Date().toISOString()
      });
      
      // Si c'est une victoire, enregistrer le timestamp pour le délai de 24h
      if (isWin.value) {
        localStorage.setItem(`lastWin_${gameState.username.value}`, Date.now().toString());
      }
      
      // Émettre l'événement pour mettre à jour l'historique
      emit('game-completed');
      
      // Afficher le résultat avec un délai pour l'animation
      setTimeout(() => {
        showResult.value = true;
      }, 1000);
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
  
  <style>
  @keyframes reveal {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-reveal {
    animation: reveal 0.3s ease-out forwards;
  }
  
  .animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
  }
  </style>