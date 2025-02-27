<template>
    <div 
      class="scratch-card" 
      :class="{ 'revealed': revealed, 'disabled': disabled }" 
      @click="scratch"
    >
      <div class="card-front">
        <!-- Affichage conditionnel des images selon le type -->
        <img v-if="type === 'ballon'" src="../assets/ballon.png" alt="Ballon de football" />
        <img v-else-if="type === 'cadeau-bleu'" src="../assets/cadeau_bleu.png" alt="Cadeau bleu" />
        <img v-else-if="type === 'cadeau-vert'" src="../assets/cadeau_vert.png" alt="Cadeau vert" />
        <img v-else-if="type === 'cadeau-rouge'" src="../assets/cadeau_rouge.png" alt="Cadeau rose" />
      </div>
      <div class="card-back">
        <img src="../assets/ballon.png" alt="Ballon de football" />
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    revealed: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'ballon'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  });
  
  const emit = defineEmits(['scratch']);
  
  const scratch = () => {
    if (!props.disabled && !props.revealed) {
      emit('scratch');
    }
  };
  </script>
  
  <style scoped>
  .scratch-card {
    aspect-ratio: 1;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.6s;
    cursor: pointer;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .scratch-card.revealed {
    transform: rotateY(180deg);
  }
  
  .scratch-card.disabled {
    cursor: default;
    opacity: 0.8;
  }
  
  .card-front, .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .card-front {
    transform: rotateY(180deg);
  }
  
  .card-back {
    background-color: #f1f1f1;
  }
  
  img {
    max-width: 80%;
    max-height: 80%;
    object-fit: contain;
  }
  </style>