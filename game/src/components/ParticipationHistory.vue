<template>
    <div v-if="participations.length > 0" class="border-t border-gray-200 pt-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Dernières participations
      </h3>
      
      <div class="space-y-3">
        <div 
          v-for="(participation, index) in participations" 
          :key="index" 
          class="flex items-center justify-between bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-150"
        >
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-800">{{ participation.username }}</p>
              <p class="text-xs text-gray-500">{{ formatDate(participation.date) }}</p>
            </div>
          </div>
          
          <span 
            class="px-3 py-1 text-sm rounded-full font-medium"
            :class="participation.isWin ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
          >
            {{ participation.isWin ? 'Gagné' : 'Perdu' }}
          </span>
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