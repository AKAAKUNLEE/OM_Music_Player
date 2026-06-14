<template>
  <div class="lyrics-panel" :class="{ 'dark': isDarkMode }" v-if="showLyrics">
    <div class="lyrics-header">
      <h3 class="lyrics-title"><Icon name="music" :size="18" /> 歌词</h3>
      <button class="btn-close" @click="toggleLyrics"><Icon name="close" :size="14" /></button>
    </div>
    
    <div class="lyrics-content" ref="lyricsContainer">
      <div v-if="parsedLyrics.length === 0" class="no-lyrics">
        <div class="no-lyrics-icon"><Icon name="list" :size="48" color="#ccc" /></div>
        <div class="no-lyrics-text">暂无歌词</div>
      </div>
      <div v-else>
        <div 
          v-for="(line, index) in parsedLyrics" 
          :key="index"
          :class="{ active: currentLyricIndex === index }"
          class="lyric-line"
        >
          {{ line.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useMusicStore } from '../stores/musicStore';
import { parseLyrics } from '../utils/format';
import Icon from './Icon.vue';

const { currentSong, currentTime, showLyrics, toggleLyrics, isDarkMode } = useMusicStore();

const lyricsContainer = ref<HTMLElement | null>(null);

const parsedLyrics = computed(() => {
  if (!currentSong.value?.lyrics) return [];
  return parseLyrics(currentSong.value.lyrics);
});

const currentLyricIndex = computed(() => {
  if (parsedLyrics.value.length === 0) return -1;
  for (let i = parsedLyrics.value.length - 1; i >= 0; i--) {
    if (currentTime.value >= parsedLyrics.value[i].time) {
      return i;
    }
  }
  return -1;
});

watch(currentLyricIndex, async (index) => {
  if (index >= 0 && lyricsContainer.value) {
    await nextTick();
    const activeLine = lyricsContainer.value.querySelector('.lyric-line.active');
    if (activeLine) {
      activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
});

watch(currentSong, () => {
  if (lyricsContainer.value) {
    lyricsContainer.value.scrollTop = 0;
  }
});
</script>

<style scoped>
.lyrics-panel {
  position: fixed;
  bottom: 70px;
  left: 240px;
  right: 0;
  height: 300px;
  background: #fff;
  border-top: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  z-index: 900;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.lyrics-panel.dark {
  background: #1a1a1a;
  border-top-color: #2a2a2a;
}

.lyrics-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid #e8e8e8;
}

.dark .lyrics-header {
  border-bottom-color: #2a2a2a;
}

.lyrics-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.dark .lyrics-title {
  color: #fff;
}

.btn-close {
  border: none;
  background: #f0f0f0;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark .btn-close {
  background: #333;
  color: #fff;
}

.lyrics-content {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lyrics-content::-webkit-scrollbar {
  width: 4px;
}

.lyrics-content::-webkit-scrollbar-track {
  background: transparent;
}

.lyrics-content::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 2px;
}

.dark .lyrics-content::-webkit-scrollbar-thumb {
  background: #333;
}

.no-lyrics {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.no-lyrics-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.no-lyrics-text {
  font-size: 14px;
  color: #999;
}

.dark .no-lyrics-text {
  color: #666;
}

.lyric-line {
  font-size: 16px;
  color: #999;
  padding: 10px 0;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.dark .lyric-line {
  color: #666;
}

.lyric-line.active {
  font-size: 20px;
  color: #ff6b6b;
  font-weight: 500;
  opacity: 1;
  transform: scale(1.05);
}

.dark .lyric-line.active {
  color: #ff6b6b;
}
</style>