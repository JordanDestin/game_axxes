import { ref, reactive } from 'vue';

export function useGameState() {
  // État utilisateur
  const username = ref('');
  const isLoggedIn = ref(false);
  
  // Historique des participations
  const participations = ref([]);
  const userParticipationCounts = reactive({});
  

  const login = () => {
    if (username.value.trim()) {
      // Mettre à jour l'état du jeu avec le nouveau nom d'utilisateur
      gameState.setUsername(username.value.trim());
      
      // Émettre l'événement pour informer le parent de la connexion
      emit('login', username.value.trim());
      
      // Stocker le nom d'utilisateur dans localStorage pour la persistance
      localStorage.setItem('username', username.value.trim());
    }
  };


  // Obtenir le nombre de participations pour l'utilisateur actuel
  const getParticipationCount = () => {
    return userParticipationCounts[username.value] || 0;
  };
  
  // Définir le nom d'utilisateur
  const setUsername = (name) => {
    username.value = name;
    isLoggedIn.value = true;
    
    // Charger l'historique des participations
    loadParticipations();
  };
  
  // Sauvegarder une participation
  const saveParticipation = async (participation) => {
    try {
      // Récupérer les participations existantes
      const allParticipations = JSON.parse(localStorage.getItem('participations') || '[]');
      
      // Ajouter la nouvelle participation
      const newParticipation = {
        ...participation,
        id: Date.now() // Simuler un ID unique
      };
      
      allParticipations.push(newParticipation);
      
      // Sauvegarder dans localStorage
      localStorage.setItem('participations', JSON.stringify(allParticipations));
      
      // Mettre à jour le compteur de participations
      if (!userParticipationCounts[username.value]) {
        userParticipationCounts[username.value] = 0;
      }
      userParticipationCounts[username.value]++;
      
      console.log(`${username.value} a maintenant ${userParticipationCounts[username.value]} participations`);
      
      // Mettre à jour l'historique local
      await loadParticipations();
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la participation:', error);
      return false;
    }
  };
  
  // Charger les participations de l'utilisateur actuel
  const loadParticipations = async () => {
    try {
      // Récupérer toutes les participations
      const allParticipations = JSON.parse(localStorage.getItem('participations') || '[]');
      
      // Filtrer par nom d'utilisateur
      const userParticipations = allParticipations
        .filter(p => p.username === username.value)
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Trier par date décroissante
      
      // Mettre à jour l'état
      participations.value = userParticipations.slice(0, 3); // 3 dernières participations
      userParticipationCounts[username.value] = userParticipations.length;
      
      console.log(`Participations chargées: ${username.value} a ${userParticipations.length} participations`);
    } catch (error) {
      console.error('Erreur lors de la récupération des participations:', error);
    }
  };
  
  // Déconnexion
  const logout = () => {
    username.value = '';
    isLoggedIn.value = false;
    participations.value = [];
    // On ne réinitialise pas userParticipationCounts pour conserver l'historique
    localStorage.removeItem('username');
  };
  
  return {
    // État
    username,
    isLoggedIn,
    participations,
    
    // Getters
    getParticipationCount,
    
    // Actions
    setUsername,
    saveParticipation,
    loadParticipations,
    login,
    logout
  };
}