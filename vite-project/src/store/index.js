import { reactive } from 'vue';
import { saveParticipation, getParticipations } from '../api/api';

const state = reactive({
  username: '',
  isLoggedIn: false,
  participations: [],
  participationCount: 0,
  userParticipationCounts: {} // Pour suivre le nombre de participations par utilisateur
});

export function useStore() {
  return {
    // State
    get username() {
      return state.username;
    },
    get isLoggedIn() {
      return state.isLoggedIn;
    },
    get participations() {
      return state.participations;
    },
    get participationCount() {
      // Récupère le nombre de participations spécifique à cet utilisateur
      return state.userParticipationCounts[state.username] || 0;
    },

    // Actions
    setUsername(username) {
      state.username = username;
      state.isLoggedIn = true;
    },
    
    async saveParticipation(participation) {
      try {
        await saveParticipation(participation);        
        // Mettre à jour le compteur spécifique à l'utilisateur
        if (!state.userParticipationCounts[state.username]) {
          state.userParticipationCounts[state.username] = 0;
        }
        state.userParticipationCounts[state.username]++;
        
        console.log(`${state.username} a maintenant ${state.userParticipationCounts[state.username]} participations`);
        return true;
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement de la participation:', error);
        return false;
      }
    },
    
    async fetchParticipations() {
      try {
        const data = await getParticipations(state.username);
        state.participations = data.participations.slice(0, 3); // 3 dernières participations
        
        // Mettre à jour le compteur pour cet utilisateur spécifique
        state.userParticipationCounts[state.username] = data.count;
        console.log(`Participations chargées: ${state.username} a ${data.count} participations`);
      } catch (error) {
        console.error('Erreur lors de la récupération des participations:', error);
      }
    },
    
    logout() {
      state.username = '';
      state.isLoggedIn = false;
      state.participations = [];
      localStorage.removeItem('username');
    }
  };
}