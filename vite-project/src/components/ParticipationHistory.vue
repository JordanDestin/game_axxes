<template>
  <div class="history-container" v-if="participations.length > 0">
    <h3>Dernières participations</h3>
    <div class="participation-list">
      <div v-for="(participation, index) in participations" :key="index" class="participation-item">
        <div class="participation-info">
          <span class="username">{{ participation.username }}</span>
          <span class="result" :class="{ 'win': participation.isWin, 'lose': !participation.isWin }">
            {{ participation.isWin ? 'Gagné' : 'Perdu' }}
          </span>
          <span class="date">{{ formatDate(participation.date) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  participations: {
    type: Array,
    default: () => []
  }
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style scoped>
.history-container {
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

h3 {
  margin-bottom: 15px;
  color: #333;
}

.participation-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.participation-item {
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.participation-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.username {
  font-weight: bold;
}

.result {
  padding: 3px 8px;
  border-radius: 3px;
  color: white;
}

.result.win {
  background-color: #4CAF50;
}

.result.lose {
  background-color: #f44336;
}

.date {
  color: #666;
  font-size: 0.9em;
}
</style>