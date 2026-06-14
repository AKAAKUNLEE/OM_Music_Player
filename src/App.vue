<template>
  <div class="app-container" :class="{ 'dark': isDarkMode }">
    <Sidebar />
    <MainContent />
    <LyricsPanel />
    <PlayerBar />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Sidebar from './components/Sidebar.vue';
import MainContent from './components/MainContent.vue';
import PlayerBar from './components/PlayerBar.vue';
import LyricsPanel from './components/LyricsPanel.vue';
import { useMusicStore } from './stores/musicStore';

const { isDarkMode, addSongs } = useMusicStore();

onMounted(() => {
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'true') {
    isDarkMode.value = true;
  }
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

#app {
  height: 100%;
}

.app-container {
  min-height: 100vh;
  background: #f5f5f7;
  transition: all 0.3s ease;
}

.app-container.dark {
  background: #121212;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}

.dark ::-webkit-scrollbar-thumb {
  background: #333;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #444;
}
</style>