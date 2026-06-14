<template>
  <div class="player-bar" :class="{ 'dark': isDarkMode }">
    <div class="player-left">
      <div class="cover-wrapper" @click="toggleLyrics">
        <img 
          v-if="currentSong?.cover" 
          :src="currentSong.cover" 
          :alt="currentSong.name"
          class="cover"
        />
        <div v-else class="cover placeholder">
          <Icon name="music" :size="24" color="#fff" />
        </div>
      </div>
      <div class="song-info">
        <div class="song-name">{{ currentSong?.name || '暂无播放' }}</div>
        <div class="artist-name">{{ currentSong?.artist || '-' }}</div>
      </div>
    </div>

    <div class="player-center">
      <div class="progress-bar-wrapper">
        <span class="time">{{ formatTime(currentTime) }}</span>
        <div class="progress-bar" @click="seekProgress">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          <div class="progress-thumb" :style="{ left: progressPercent + '%' }"></div>
        </div>
        <span class="time">{{ formatTime(duration) }}</span>
      </div>
      <div class="control-buttons">
        <button class="btn-control" @click="toggleRepeat" :title="repeatTitle">
          <Icon :name="repeatIcon" :size="16" />
        </button>
        <button class="btn-control" @click="playPrev">
          <Icon name="skip-prev" :size="16" />
        </button>
        <button class="btn-play" @click="togglePlay">
          <Icon :name="isPlaying ? 'pause' : 'play'" :size="20" color="#fff" />
        </button>
        <button class="btn-control" @click="playNext">
          <Icon name="skip-next" :size="16" />
        </button>
        <button class="btn-control" @click="toggleLyrics" title="歌词">
          <Icon name="list" :size="16" />
        </button>
      </div>
    </div>

    <div class="player-right">
      <button class="btn-control" @click="toggleMute">
        <Icon :name="isMuted ? 'volume-off' : 'volume'" :size="16" />
      </button>
      <div class="volume-bar-wrapper">
        <div class="volume-bar" @click="changeVolume">
          <div class="volume-fill" :style="{ width: (isMuted ? 0 : volume * 100) + '%' }"></div>
          <div class="volume-thumb" :style="{ left: (isMuted ? 0 : volume * 100) + '%' }"></div>
        </div>
      </div>
      <button class="btn-control" @click="toggleDarkMode">
        <Icon :name="isDarkMode ? 'sunny' : 'moon'" :size="16" />
      </button>
    </div>

    <audio ref="audioRef" @timeupdate="updateTime" @loadedmetadata="onLoaded" @ended="handleEnded" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useMusicStore } from '../stores/musicStore';
import { formatTime } from '../utils/format';
import Icon from './Icon.vue';

const {
  currentSong,
  currentIndex,
  playlist,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  repeatMode,
  isDarkMode,
  playSong,
  togglePlay,
  playPrev,
  playNext,
  toggleRepeat,
  toggleMute,
  toggleDarkMode,
  toggleLyrics,
} = useMusicStore();

const audioRef = ref<HTMLAudioElement | null>(null);
const progressPercent = computed(() => {
  if (!duration.value || !currentTime.value) return 0;
  return (currentTime.value / duration.value) * 100;
});

const repeatIcon = computed(() => {
  switch (repeatMode.value) {
    case 'single': return 'repeat-single';
    case 'random': return 'shuffle';
    default: return 'repeat';
  }
});

const repeatTitle = computed(() => {
  switch (repeatMode.value) {
    case 'single': return '单曲循环';
    case 'random': return '随机播放';
    default: return '列表循环';
  }
});

function updateTime() {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime;
  }
}

function onLoaded() {
  if (audioRef.value) {
    duration.value = audioRef.value.duration;
  }
}

function seekProgress(e) {
  if (!audioRef.value || !duration.value) return;
  const rect = e.target.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  const time = percent * duration.value;
  audioRef.value.currentTime = time;
  currentTime.value = time;
}

function changeVolume(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  const newVolume = Math.max(0, Math.min(1, percent));
  if (audioRef.value) {
    audioRef.value.volume = newVolume;
  }
  volume.value = newVolume;
  isMuted.value = newVolume === 0;
}

function handleEnded() {
  if (repeatMode.value === 'single') {
    if (audioRef.value) {
      audioRef.value.currentTime = 0;
      audioRef.value.play();
    }
  } else {
    playNext();
  }
}

watch(currentIndex, (index) => {
  if (index >= 0 && index < playlist.value.length) {
    const song = playlist.value[index];
    if (song.url && audioRef.value) {
      audioRef.value.src = song.url;
      audioRef.value.play();
      isPlaying.value = true;
    }
  }
});

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = volume.value;
  }
});
</script>

<style scoped>
.player-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #fff;
  border-top: 1px solid #e8e8e8;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  transition: all 0.3s ease;
}

.player-bar.dark {
  background: #1a1a1a;
  border-top-color: #2a2a2a;
}

.player-left {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 250px;
}

.cover-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
}

.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
}

.song-info {
  overflow: hidden;
}

.song-name {
  font-size: 14px;
  font-weight: 500;
  color: #222;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .song-name {
  color: #fff;
}

.artist-name {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .artist-name {
  color: #999;
}

.player-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 0 40px;
}

.progress-bar-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 500px;
}

.time {
  font-size: 12px;
  color: #666;
  min-width: 40px;
  text-align: center;
}

.dark .time {
  color: #999;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  position: relative;
  cursor: pointer;
}

.dark .progress-bar {
  background: #333;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
  border-radius: 2px;
  transition: width 0.1s linear;
}

.progress-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.progress-bar:hover .progress-thumb {
  opacity: 1;
}

.control-buttons {
  display: flex;
  align-items: center;
  gap: 15px;
}

.btn-control {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-control:hover {
  background: #f0f0f0;
}

.dark .btn-control:hover {
  background: #333;
}

.btn-play {
  width: 44px;
  height: 44px;
  border: none;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  border-radius: 50%;
  font-size: 18px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);
}

.btn-play:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.5);
}

.player-right {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 200px;
  justify-content: flex-end;
}

.volume-bar-wrapper {
  width: 80px;
}

.volume-bar {
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  position: relative;
  cursor: pointer;
}

.dark .volume-bar {
  background: #333;
}

.volume-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ecdc4, #44a08d);
  border-radius: 2px;
  transition: width 0.1s linear;
}

.volume-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.volume-bar:hover .volume-thumb {
  opacity: 1;
}
</style>