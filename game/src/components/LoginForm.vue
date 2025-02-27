<template>
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="text-center mb-4">
          <h2 class="h3 fw-bold">Identifiez-vous</h2>
          <p class="text-muted">Entrez votre pseudo pour commencer à jouer</p>
        </div>
        
        <div class="form-group mb-3">
          <label for="username" class="form-label">Votre pseudo</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            placeholder="Entrez votre pseudo"
            @keyup.enter="login"
            class="form-control form-control-lg"
          />
        </div>
        
        <div class="d-grid gap-2">
          <button 
            @click="login" 
            :disabled="!username"
            class="btn btn-primary btn-lg"
          >
            <i class="bi bi-play-fill me-2"></i>
            Commencer à jouer
          </button>
        </div>
        
        <div class="mt-4 text-center text-muted small">
          <i class="bi bi-shield-lock me-1"></i>
          Vos données sont stockées localement sur votre appareil.
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useGameState } from '../composables/useGameState';
  
  const emit = defineEmits(['login']);
  const gameState = useGameState();
  const username = ref('');
  
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
  </script>