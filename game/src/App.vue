<template>
  <div class="container py-4">
    <!-- En-tête -->
    <header class="pb-3 mb-4 border-bottom">
      <h1 class="text-primary fw-bold">Jeu de Grattage</h1>
      <p class="text-muted">Tentez votre chance et gagnez des prix exceptionnels !</p>
    </header>
    
    <!-- Conteneur principal -->
    <main>
      <!-- Écran de connexion -->
      <div v-if="!gameState.isLoggedIn.value" class="card p-4 shadow-sm">
        <LoginForm @login="handleLogin" />
      </div>
      
      <!-- Écran de jeu -->
      <div v-else>
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-primary text-white">
            <h2 class="h5 mb-0">Bienvenue, {{ gameState.username.value }} !</h2>
          </div>
          <div class="card-body">
            <ScratchGame @game-completed="loadHistory" @logout="handleLogout" />
          </div>
        </div>
        
        <div class="card shadow-sm">
          <div class="card-body">
            <ParticipationHistory :participations="gameState.participations.value" />
          </div>
        </div>
      </div>
    </main>
    
    <!-- Footer -->
    <footer class="pt-3 mt-4 text-muted border-top text-center small">
      © {{ new Date().getFullYear() }} Jeu de Grattage - Tous droits réservés
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useGameState } from './composables/useGameState';
import LoginForm from './components/LoginForm.vue';
import ScratchGame from './components/ScratchGame.vue';
import ParticipationHistory from './components/ParticipationHistory.vue';

const gameState = useGameState();

const handleLogin = (username) => {
  // Le composant LoginForm a déjà mis à jour le gameState
  loadHistory();
};

const handleLogout = () => {
  // Le composant ScratchGame a déjà mis à jour le gameState
};

const loadHistory = async () => {
  await gameState.loadParticipations();
};

onMounted(() => {
  // Vérifier si l'utilisateur est déjà connecté (localStorage)
  const savedUsername = localStorage.getItem('username');
  if (savedUsername) {
    gameState.setUsername(savedUsername);
    loadHistory();
  }
});
</script>

<style>
body {
  background-color: #f8f9fa;
}
</style>