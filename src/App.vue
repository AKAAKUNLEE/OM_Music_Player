<template>
  <div class="app-container" :class="{ 'dark': isDarkMode }">
    <Sidebar @navigate="handleNavigate" />
    <main class="main-content-wrapper">
      <transition name="fade" mode="out-in">
        <component :is="currentPage" :key="currentPageName" />
      </transition>
    </main>
    <LyricsPanel />
    <PlayerBar />
  </div>
</template>

<script setup>
import { ref, markRaw, onMounted } from 'vue';
import Sidebar from './components/Sidebar.vue';
import PlayerBar from './components/PlayerBar.vue';
import LyricsPanel from './components/LyricsPanel.vue';
import RecommendPage from './views/RecommendPage.vue';
import SonglistPage from './views/SonglistPage.vue';
import RadioPage from './views/RadioPage.vue';
import MyPage from './views/MyPage.vue';
import { useMusicStore } from './stores/musicStore';

const { isDarkMode, addSongs } = useMusicStore();

const currentPageName = ref('recommend');

const pages = {
  recommend: markRaw(RecommendPage),
  songlist: markRaw(SonglistPage),
  radio: markRaw(RadioPage),
  my: markRaw(MyPage)
};

const currentPage = ref(pages.recommend);

function handleNavigate(pageName) {
  currentPageName.value = pageName;
  currentPage.value = pages[pageName] || pages.recommend;
}

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

.main-content-wrapper {
  margin-left: 240px;
  min-height: 100vh;
  padding-bottom: 70px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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