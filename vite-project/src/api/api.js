export async function saveParticipation(participation) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Récupérer les participations existantes
        const participations = JSON.parse(localStorage.getItem('participations') || '[]');
        
        // Ajouter la nouvelle participation
        participations.push({
          ...participation,
          id: Date.now() // Simuler un ID unique
        });
        
        // Sauvegarder les participations
        localStorage.setItem('participations', JSON.stringify(participations));
        
        resolve({ success: true });
      }, 300); // Simuler un délai réseau
    });
  }
  
  // Fonction pour récupérer les participations d'un utilisateur
  export async function getParticipations(username) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Récupérer toutes les participations
        const allParticipations = JSON.parse(localStorage.getItem('participations') || '[]');
        
        // Filtrer par nom d'utilisateur
        const userParticipations = allParticipations
          .filter(p => p.username === username)
          .sort((a, b) => new Date(b.date) - new Date(a.date)); // Trier par date décroissante
        
        resolve({
          participations: userParticipations,
          count: userParticipations.length
        });
      }, 300); // Simuler un délai réseau
    });
  }
  