<template>
  <div class="sidebar" :class="{ 'dark': isDarkMode }">
    <div class="logo-section">
      <div class="logo">
        <Icon name="music" :size="24" color="#fff" />
      </div>
      <div class="logo-text">OM Music</div>
    </div>

    <nav class="nav-section">
      <h3 class="nav-title">导航</h3>
      <ul class="nav-list">
        <li 
          v-for="item in categories" 
          :key="item.id"
          :class="{ active: activeNav === item.id }"
          @click="handleNavClick(item.id)"
        >
          <Icon :name="item.icon" :size="18" />
          <span class="nav-name">{{ item.name }}</span>
        </li>
      </ul>
    </nav>

    <div class="playlist-section">
      <div class="section-header">
        <h3 class="section-title">播放列表</h3>
        <button class="btn-add" @click="selectMusicFiles">
          <Icon name="plus" :size="16" color="#fff" />
        </button>
      </div>
      <div class="playlist-list" ref="playlistContainer">
        <div 
          v-for="(song, index) in playlist" 
          :key="song.id"
          :class="{ active: currentIndex === index }"
          class="playlist-item"
          @click="playSong(index)"
        >
          <div class="item-index">{{ index + 1 }}</div>
          <div class="item-info">
            <div class="item-name">{{ song.name }}</div>
            <div class="item-artist">{{ song.artist }}</div>
          </div>
          <button class="btn-delete" @click.stop="removeSong(index)">
            <Icon name="close" :size="12" />
          </button>
        </div>
        <div v-if="playlist.length === 0" class="empty-playlist">
          <div class="empty-icon">
            <Icon name="music" :size="48" color="#ccc" />
          </div>
          <div class="empty-text">暂无音乐</div>
          <div class="empty-hint">点击上方 + 添加本地音乐</div>
        </div>
      </div>
    </div>

    <div class="footer-section">
      <div class="version">v1.0.0</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMusicStore } from '../stores/musicStore';
import { categories } from '../utils/demoData';
import { open } from '@tauri-apps/plugin-dialog';
import { convertFileSrc } from '@tauri-apps/api/core';
import Icon from './Icon.vue';

const emit = defineEmits(['navigate']);

const { 
  playlist, 
  currentIndex, 
  isDarkMode,
  addSongs, 
  playSong, 
  removeSong 
} = useMusicStore();

const activeNav = ref('recommend');
const playlistContainer = ref(null);

function handleNavClick(navId) {
  activeNav.value = navId;
  emit('navigate', navId);
}

async function selectMusicFiles() {
  const selected = await open({
    multiple: true,
    filters: [{
      name: '音频文件',
      extensions: ['mp3', 'flac', 'wav', 'm4a', 'ogg']
    }]
  });

  if (!selected || selected.length === 0) return;

  const newSongs = selected.map((filePath) => {
    const fileName = filePath.split(/[\\/]/).pop() || '';
    const nameParts = fileName.replace(/\.[^.]+$/, '').split(' - ');
    return {
      id: Date.now().toString() + Math.random(),
      name: nameParts[0] || fileName.replace(/\.[^.]+$/, ''),
      artist: nameParts[1] || '未知艺术家',
      album: '未知专辑',
      duration: 0,
      url: convertFileSrc(filePath),
      cover: `https://neeko-copilot.bytedance.net/api/text_to_image?prompt=music%20album%20cover%20abstract%20colorful%20art&image_size=square`,
      lyrics: ''
    };
  });

  addSongs(newSongs);
}
</script>

<style scoped>
.sidebar {
  width: 240px;
  height: 100vh;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 70px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.sidebar.dark {
  background: #0d0d0d;
  border-right-color: #2a2a2a;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border-bottom: 1px solid #e8e8e8;
}

.dark .logo-section {
  border-bottom-color: #2a2a2a;
}

.logo {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-section {
  padding: 15px;
}

.nav-title {
  font-size: 12px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

.dark .nav-title {
  color: #666;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 4px;
}

.nav-list li:hover {
  background: #f5f5f7;
}

.dark .nav-list li:hover {
  background: #1a1a1a;
}

.nav-list li.active {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(78, 205, 196, 0.1));
}

.nav-list li.active .nav-name {
  color: #ff6b6b;
  font-weight: 500;
}

.nav-icon {
  font-size: 18px;
}

.nav-name {
  font-size: 14px;
  color: #333;
}

.dark .nav-name {
  color: #ccc;
}

.playlist-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 15px;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dark .section-title {
  color: #666;
}

.btn-add {
  width: 24px;
  height: 24px;
  border: none;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  color: #fff;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-add:hover {
  transform: scale(1.1);
}

.playlist-list {
  flex: 1;
  overflow-y: auto;
}

.playlist-list::-webkit-scrollbar {
  width: 4px;
}

.playlist-list::-webkit-scrollbar-track {
  background: transparent;
}

.playlist-list::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 2px;
}

.dark .playlist-list::-webkit-scrollbar-thumb {
  background: #333;
}

.playlist-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 4px;
}

.playlist-item:hover {
  background: #f5f5f7;
}

.dark .playlist-item:hover {
  background: #1a1a1a;
}

.playlist-item.active {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.15), rgba(78, 205, 196, 0.15));
}

.item-index {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #999;
  font-weight: 500;
}

.playlist-item.active .item-index {
  color: #ff6b6b;
}

.item-info {
  flex: 1;
  overflow: hidden;
}

.item-name {
  font-size: 13px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .item-name {
  color: #ccc;
}

.item-artist {
  font-size: 11px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.btn-delete {
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: #ccc;
  border-radius: 50%;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;
}

.playlist-item:hover .btn-delete {
  opacity: 1;
}

.btn-delete:hover {
  background: #ff6b6b;
  color: #fff;
}

.empty-playlist {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.empty-text {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.dark .empty-text {
  color: #555;
}

.empty-hint {
  font-size: 12px;
  color: #999;
}

.dark .empty-hint {
  color: #666;
}

.footer-section {
  padding: 15px;
  border-top: 1px solid #e8e8e8;
}

.dark .footer-section {
  border-top-color: #2a2a2a;
}

.version {
  font-size: 11px;
  color: #999;
  text-align: center;
}

.dark .version {
  color: #555;
}
</style>