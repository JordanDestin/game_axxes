# Jeu de Grattage - Application Vue 3

Une application interactive de jeu de grattage développée avec Vue 3, Vite et Bootstrap. Les joueurs peuvent gratter des ballons virtuels pour découvrir des cadeaux et potentiellement gagner des prix.

## 🎮 Fonctionnalités

- **Authentification par pseudo** - Les joueurs s'identifient facilement avec un pseudo
- **Jeu interactif** - Interface intuitive avec 9 ballons à gratter
- **Système de récompenses** - Victoire garantie à la 3ème participation
- **Période d'attente** - Délai de 24h après une victoire pour maintenir l'intérêt
- **Historique** - Suivi des 3 dernières participations
- **Stockage local** - Persistance des données utilisateur via localStorage
- **Design responsive** - Interface adaptée à tous les appareils
- **Animations** - Animations fluides pour une meilleure expérience utilisateur

## 📋 Prérequis

- Node.js (v14.0.0 ou supérieur)
- npm (v6.0.0 ou supérieur)

## 🚀 Installation

1. Clonez le dépôt GitHub :

```bash
git clone https://github.com/JordanDestin/game_axxes.git
cd vite-project
```

2. Installez les dépendances :

```bash
npm install
```

3. Lancez le serveur de développement :

```bash
npm run dev
```

4. Ouvrez votre navigateur à l'adresse indiquée (généralement http://localhost:5173)

## 🔧 Configuration

### Personnaliser les probabilités de gain

Pour modifier la règle de gain (actuellement fixée à la 3ème participation), modifiez la fonction `determineWin()` dans le fichier `src/components/ScratchGame.vue` :

```javascript
// Pour changer la règle de victoire, modifiez cette fonction
const determineWin = () => {
  // Actuellement : gagner précisément à la 3ème participation
  return gameState.getParticipationCount() === 2; // Indice 2 = 3ème participation (0, 1, 2)
  
  // Autres options possibles:
  // Gagner toutes les X participations
  // return (gameState.getParticipationCount() + 1) % X === 0;
  
  // Chance aléatoire de X%
  // return Math.random() < X/100;
};
```

### Modifier le temps d'attente

Pour changer la période d'attente après une victoire (24h par défaut), modifiez cette ligne dans le fichier `src/components/ScratchGame.vue` :

```javascript
// Changer 24 par le nombre d'heures souhaité
const waitUntilTime = parseInt(lastWinTimestamp) + (24 * 60 * 60 * 1000);
```

## 📁 Structure du projet

```
jeu-de-grattage/
├── public/              # Ressources statiques 
├── src/
│   ├── assets/          # Images et ressources
│   ├── components/      # Composants Vue
│   │   ├── LoginForm.vue        # Formulaire de connexion
│   │   ├── ScratchGame.vue      # Jeu principal
│   │   └── ParticipationHistory.vue # Historique des participations
│   ├── composables/     # Logique réutilisable
│   │   └── useGameState.js      # Gestion de l'état du jeu
│   ├── styles/          # Styles CSS personnalisés
│   ├── App.vue          # Composant racine
│   └── main.js          # Point d'entrée de l'application
├── index.html           # Template HTML
└── vite.config.js       # Configuration Vite
