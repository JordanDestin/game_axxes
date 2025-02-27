<template>
  <div class="login-form">
    <h2>Identification</h2>
    <div class="form-group">
      <label for="username">Votre pseudo</label>
      <input 
        type="text" 
        id="username" 
        v-model="username" 
        placeholder="Entrez votre pseudo"
        @keyup.enter="login"
      />
    </div>
    <button @click="login" :disabled="!username">Commencer à jouer</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['login']);
const username = ref('');

const login = () => {
  if (username.value.trim()) {
    emit('login', username.value.trim());
    localStorage.setItem('username', username.value.trim());
  }
};
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-weight: bold;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

button {
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) {
  background-color: #0052a3;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>