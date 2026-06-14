<template>
  <div class="page my-page" :class="{ 'dark': isDarkMode }">
    <div class="user-header">
      <div class="user-avatar">👤</div>
      <div class="user-info">
        <h2 class="user-name">OM Music 用户</h2>
        <p class="user-desc">音乐爱好者</p>
      </div>
      <button class="btn-edit">编辑资料</button>
    </div>

    <div class="content-area">
      <div class="stats-row">
        <div class="stat-item">
          <div class="stat-value">{{ playlist.length }}</div>
          <div class="stat-label">收藏歌曲</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ 12 }}</div>
          <div class="stat-label">创建歌单</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ 89 }}</div>
          <div class="stat-label">关注</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ 256 }}</div>
          <div class="stat-label">粉丝</div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h3 class="section-title">🎵 我的收藏</h3>
          <button class="btn-manage">管理</button>
        </div>
        <div class="song-list">
          <div 
            v-for="(song, index) in playlist.slice(0, 5)" 
            :key="song.id"
            :class="{ active: currentIndex === index }"
            class="song-item"
            @click="playSong(index)"
          >
            <div class="song-index">{{ index + 1 }}</div>
            <img v-if="song.cover" :src="song.cover" class="song-cover" />
            <div class="song-info">
              <div class="song-name">{{ song.name }}</div>
              <div class="song-artist">{{ song.artist }}</div>
            </div>
            <div class="song-duration">{{ formatDuration(song.duration) }}</div>
          </div>
          <div v-if="playlist.length === 0" class="empty-state">
            <div class="empty-icon">🎶</div>
            <div class="empty-text">暂无收藏歌曲</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h3 class="section-title">📋 创建的歌单</h3>
          <button class="btn-create">+ 创建歌单</button>
        </div>
        <div class="playlist-list">
          <div 
            v-for="playlist in myPlaylists" 
            :key="playlist.id"
            class="playlist-item"
            @click="openPlaylist(playlist)"
          >
            <img :src="playlist.cover" class="playlist-cover" />
            <div class="playlist-info">
              <div class="playlist-name">{{ playlist.name }}</div>
              <div class="playlist-count">{{ playlist.songCount }} 首歌曲</div>
            </div>
            <div class="playlist-arrow">→</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h3 class="section-title">🎧 最近播放</h3>
        </div>
        <div class="recent-list">
          <div 
            v-for="(song, index) in recentSongs" 
            :key="index"
            class="recent-item"
            @click="playSong(getIndexById(song.id))"
          >
            <div class="recent-index">{{ index + 1 }}</div>
            <div class="recent-info">
              <div class="recent-name">{{ song.name }}</div>
              <div class="recent-artist">{{ song.artist }}</div>
            </div>
            <div class="recent-time">{{ song.lastPlayed }}</div>
          </div>
        </div>
      </div>

      <div class="section settings-section">
        <div class="settings-header">
          <h3 class="section-title">⚙️ 设置</h3>
        </div>
        <div class="settings-list">
          <div class="setting-item" @click="toggleTheme">
            <span class="setting-icon">🎨</span>
            <span class="setting-name">主题模式</span>
            <span class="setting-value">{{ isDarkMode ? '深色' : '浅色' }}</span>
          </div>
          <div class="setting-item">
            <span class="setting-icon">🔊</span>
            <span class="setting-name">音效设置</span>
            <span class="setting-arrow">→</span>
          </div>
          <div class="setting-item">
            <span class="setting-icon">📁</span>
            <span class="setting-name">本地音乐</span>
            <span class="setting-arrow">→</span>
          </div>
          <div class="setting-item">
            <span class="setting-icon">👤</span>
            <span class="setting-name">账号管理</span>
            <span class="setting-arrow">→</span>
          </div>
          <div class="setting-item">
            <span class="setting-icon">ℹ️</span>
            <span class="setting-name">关于我们</span>
            <span class="setting-arrow">→</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMusicStore } from '../stores/musicStore';
import { formatDuration } from '../utils/format';
import { demoPlaylist } from '../utils/demoData';

const { playlist, currentIndex, isDarkMode, toggleDarkMode, playSong } = useMusicStore();

const myPlaylists = ref([
  {
    id: '1',
    name: '我喜欢的音乐',
    songCount: playlist.value.length,
    cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=favorite%20music%20playlist%20colorful%20hearts&image_size=square'
  },
  {
    id: '2',
    name: '跑步必备',
    songCount: 25,
    cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=running%20music%20energetic%20sports&image_size=square'
  },
  {
    id: '3',
    name: '学习专注',
    songCount: 40,
    cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=study%20music%20focus%20library%20peaceful&image_size=square'
  }
]);

const recentSongs = ref([
  { id: demoPlaylist[0].id, name: demoPlaylist[0].name, artist: demoPlaylist[0].artist, lastPlayed: '刚刚' },
  { id: demoPlaylist[1].id, name: demoPlaylist[1].name, artist: demoPlaylist[1].artist, lastPlayed: '10分钟前' },
  { id: demoPlaylist[2].id, name: demoPlaylist[2].name, artist: demoPlaylist[2].artist, lastPlayed: '1小时前' },
  { id: demoPlaylist[3].id, name: demoPlaylist[3].name, artist: demoPlaylist[3].artist, lastPlayed: '昨天' },
  { id: demoPlaylist[4].id, name: demoPlaylist[4].name, artist: demoPlaylist[4].artist, lastPlayed: '2天前' }
]);

function getIndexById(songId) {
  return playlist.value.findIndex(s => s.id === songId);
}

function openPlaylist(playlist) {
  alert(`打开歌单：${playlist.name}`);
}

function toggleTheme() {
  toggleDarkMode();
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f7;
  padding: 20px;
  padding-top: 80px;
  transition: all 0.3s ease;
}

.page.dark {
  background: #121212;
}

.user-header {
  position: fixed;
  top: 0;
  left: 240px;
  right: 0;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 40px;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  z-index: 100;
}

.user-avatar {
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 5px;
}

.user-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.btn-edit {
  padding: 10px 25px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit:hover {
  background: rgba(255, 255, 255, 0.3);
}

.content-area {
  max-width: 800px;
  margin: 0 auto;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-item {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.dark .stat-item {
  background: #1a1a1a;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #ff6b6b;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 13px;
  color: #999;
}

.dark .stat-label {
  color: #666;
}

.section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.dark .section {
  background: #1a1a1a;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.dark .section-title {
  color: #fff;
}

.btn-manage, .btn-create {
  border: none;
  background: transparent;
  color: #999;
  font-size: 14px;
  cursor: pointer;
}

.btn-manage:hover, .btn-create:hover {
  color: #ff6b6b;
}

.song-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.song-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.song-item:hover {
  background: #f8f8fa;
}

.dark .song-item:hover {
  background: #222;
}

.song-item.active {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(78, 205, 196, 0.1));
}

.song-index {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #999;
}

.song-cover {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
}

.song-info {
  flex: 1;
}

.song-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.dark .song-name {
  color: #fff;
}

.song-artist {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.song-duration {
  font-size: 13px;
  color: #999;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.empty-text {
  font-size: 14px;
  color: #999;
}

.playlist-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.playlist-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.playlist-item:hover {
  background: #f8f8fa;
}

.dark .playlist-item:hover {
  background: #222;
}

.playlist-cover {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.playlist-info {
  flex: 1;
}

.playlist-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.dark .playlist-name {
  color: #fff;
}

.playlist-count {
  font-size: 12px;
  color: #999;
  margin-top: 3px;
}

.playlist-arrow {
  color: #ccc;
  font-size: 18px;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.recent-item:hover {
  background: #f8f8fa;
}

.dark .recent-item:hover {
  background: #222;
}

.recent-index {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #999;
}

.recent-info {
  flex: 1;
}

.recent-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.dark .recent-name {
  color: #fff;
}

.recent-artist {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.recent-time {
  font-size: 12px;
  color: #999;
}

.settings-section {
  margin-bottom: 100px;
}

.settings-list {
  display: flex;
  flex-direction: column;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 10px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dark .setting-item {
  border-bottom-color: #2a2a2a;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item:hover {
  background: #f8f8fa;
}

.dark .setting-item:hover {
  background: #222;
}

.setting-icon {
  font-size: 18px;
}

.setting-name {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.dark .setting-name {
  color: #ccc;
}

.setting-value {
  font-size: 14px;
  color: #999;
}

.setting-arrow {
  font-size: 16px;
  color: #ccc;
}
</style>