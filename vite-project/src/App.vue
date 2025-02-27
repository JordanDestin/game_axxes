<template>
  <div class="app-container">
    <h1>Jeu de Grattage</h1>
    
    <div v-if="!store.isLoggedIn" class="login-container">
      <LoginForm @login="handleLogin" />
    </div>
    
    <div v-else class="game-container">
      <h2>Bienvenue, {{ store.username }}</h2>
      <ScratchGame @game-completed="loadHistory" />
      <ParticipationHistory :participations="store.participations" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useStore } from './store';
import LoginForm from './components/LoginForm.vue';
import ScratchGame from './components/ScratchGame.vue';
import ParticipationHistory from './components/ParticipationHistory.vue';

const store = useStore();

const handleLogin = (username) => {
  store.setUsername(username);
  loadHistory();
};

const loadHistory = async () => {
  await store.fetchParticipations();
};

onMounted(() => {
  // Vérifier si l'utilisateur est déjà connecté (localStorage)
  const savedUsername = localStorage.getItem('username');
  if (savedUsername) {
    store.setUsername(savedUsername);
    loadHistory();
  }
});
</script>

<style>
.app-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.login-container, .game-container {
  margin-top: 20px;
  padding: 20px;
  border-radius: 8px;
  background-color: #f0f8ff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #0066cc;
  text-align: center;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}
</style>

