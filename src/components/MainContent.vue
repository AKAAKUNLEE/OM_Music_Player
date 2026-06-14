<template>
  <div class="main-content" :class="{ 'dark': isDarkMode }">
    <div class="search-section">
      <div class="search-box">
        <Icon name="search" :size="16" class="search-icon" />
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="搜索歌曲、歌手、专辑..."
          class="search-input"
          @focus="showHotSearches = true"
          @input="handleSearch"
        />
        <button v-if="searchQuery" class="btn-clear" @click="clearSearch"><Icon name="close" :size="12" /></button>
      </div>
      <div v-if="showHotSearches" class="hot-searches" @click.self="showHotSearches = false">
        <div class="hot-title">热门搜索</div>
        <div class="hot-list">
          <span 
            v-for="(item, index) in hotSearches" 
            :key="item"
            :class="{ 'hot': index < 3 }"
            @click="searchQuery = item; showHotSearches = false"
          >
            {{ index + 1 }}. {{ item }}
          </span>
        </div>
      </div>
    </div>

    <div class="content-area">
      <div class="banner-section">
        <div class="banner">
          <div class="banner-content">
            <h2 class="banner-title"><Icon name="disc" :size="28" color="#fff" /> OM Music Player</h2>
            <p class="banner-subtitle">发现音乐的无限可能</p>
          </div>
          <div class="banner-decoration">
            <div class="circle circle1"></div>
            <div class="circle circle2"></div>
            <div class="circle circle3"></div>
          </div>
        </div>
      </div>

      <div class="recommend-section">
        <div class="section-header">
          <h3 class="section-title">推荐歌单</h3>
          <button class="btn-more">查看全部 <Icon name="arrow-right" :size="14" /></button>
        </div>
        <div class="playlist-grid">
          <div 
            v-for="(item, index) in recommendPlaylists" 
            :key="index"
            class="playlist-card"
            @click="handlePlaylistClick(item)"
          >
            <div class="card-cover">
              <img :src="item.cover" :alt="item.name" />
              <div class="card-play"><Icon name="play" :size="14" color="#fff" /></div>
            </div>
            <div class="card-info">
              <div class="card-name">{{ item.name }}</div>
              <div class="card-desc">{{ item.desc }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="songs-section">
        <div class="section-header">
          <h3 class="section-title">热门歌曲</h3>
        </div>
        <div class="songs-table">
          <table>
            <thead>
              <tr>
                <th class="col-index">#</th>
                <th class="col-title">歌曲</th>
                <th class="col-artist">歌手</th>
                <th class="col-album">专辑</th>
                <th class="col-duration">时长</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(song, index) in displaySongs" 
                :key="song.id"
                :class="{ active: currentIndex === getOriginalIndex(song.id) }"
                @click="playSong(getOriginalIndex(song.id))"
              >
                <td class="col-index">{{ index + 1 }}</td>
                <td class="col-title">
                  <div class="song-info">
                    <img v-if="song.cover" :src="song.cover" class="song-cover" />
                    <div class="song-detail">
                      <div class="song-name">{{ song.name }}</div>
                      <div class="song-artist-small">{{ song.artist }}</div>
                    </div>
                  </div>
                </td>
                <td class="col-artist">{{ song.artist }}</td>
                <td class="col-album">{{ song.album }}</td>
                <td class="col-duration">{{ formatDuration(song.duration) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useMusicStore } from '../stores/musicStore';
import { demoPlaylist, hotSearches } from '../utils/demoData';
import { formatDuration } from '../utils/format';
import Icon from './Icon.vue';

const { playlist, currentIndex, isDarkMode, addSongs, playSong } = useMusicStore();

const searchQuery = ref('');
const showHotSearches = ref(false);
const allSongs = ref(demoPlaylist);

const recommendPlaylists = ref([
  {
    name: '周杰伦精选',
    desc: '华语乐坛天王的经典之作',
    cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=music%20album%20collection%20jay%20chou%20pop%20star%20colorful&image_size=square'
  },
  {
    name: '治愈系音乐',
    desc: '放松心情，治愈心灵',
    cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=healing%20music%20nature%20peaceful%20forest%20sunset&image_size=square'
  },
  {
    name: '欧美流行',
    desc: '全球热门流行金曲',
    cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=western%20pop%20music%20neon%20lights%20concert&image_size=square'
  },
  {
    name: '电子舞曲',
    desc: '动感节奏，嗨翻全场',
    cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=electronic%20dance%20music%20neon%20disco%20party&image_size=square'
  }
]);

const displaySongs = computed(() => {
  if (!searchQuery.value) return allSongs.value;
  const query = searchQuery.value.toLowerCase();
  return allSongs.value.filter(song => 
    song.name.toLowerCase().includes(query) ||
    song.artist.toLowerCase().includes(query) ||
    song.album.toLowerCase().includes(query)
  );
});

function getOriginalIndex(songId) {
  const index = playlist.value.findIndex(s => s.id === songId);
  if (index >= 0) return index;
  return -1;
}

function handleSearch() {
  showHotSearches.value = false;
}

function clearSearch() {
  searchQuery.value = '';
}

function handlePlaylistClick(playlistItem) {
  addSongs(allSongs.value);
}

onMounted(() => {
  addSongs(allSongs.value);
});
</script>

<style scoped>
.main-content {
  margin-left: 240px;
  margin-bottom: 70px;
  min-height: 100vh;
  background: #f5f5f7;
  padding: 20px;
  transition: all 0.3s ease;
}

.main-content.dark {
  background: #121212;
}

.search-section {
  position: relative;
  max-width: 500px;
  margin: 0 auto 30px;
}

.search-box {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 30px;
  padding: 10px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
}

.dark .search-box {
  background: #1a1a1a;
  border-color: #333;
}

.search-icon {
  font-size: 16px;
  margin-right: 10px;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #333;
}

.dark .search-input {
  color: #fff;
}

.search-input::placeholder {
  color: #999;
}

.btn-clear {
  border: none;
  background: #e8e8e8;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark .btn-clear {
  background: #333;
}

.hot-searches {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 15px;
  z-index: 100;
}

.dark .hot-searches {
  background: #1a1a1a;
}

.hot-title {
  font-size: 12px;
  font-weight: 600;
  color: #999;
  margin-bottom: 12px;
}

.dark .hot-title {
  color: #666;
}

.hot-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hot-list span {
  padding: 6px 12px;
  background: #f5f5f7;
  border-radius: 20px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dark .hot-list span {
  background: #2a2a2a;
  color: #999;
}

.hot-list span.hot {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.15), rgba(78, 205, 196, 0.15));
  color: #ff6b6b;
}

.dark .hot-list span.hot {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(78, 205, 196, 0.2));
}

.hot-list span:hover {
  background: #e8e8e8;
}

.dark .hot-list span:hover {
  background: #333;
}

.content-area {
  max-width: 1200px;
  margin: 0 auto;
}

.banner-section {
  margin-bottom: 30px;
}

.banner {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  border-radius: 16px;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.banner-content {
  position: relative;
  z-index: 2;
}

.banner-title {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 10px;
}

.banner-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.banner-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle1 {
  width: 150px;
  height: 150px;
  top: -50px;
  right: -50px;
}

.circle2 {
  width: 100px;
  height: 100px;
  top: 50%;
  right: 50px;
  transform: translateY(-50%);
}

.circle3 {
  width: 80px;
  height: 80px;
  bottom: -20px;
  right: 100px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.dark .section-title {
  color: #fff;
}

.btn-more {
  border: none;
  background: transparent;
  color: #999;
  font-size: 14px;
  cursor: pointer;
}

.btn-more:hover {
  color: #ff6b6b;
}

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.playlist-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.2s ease;
}

.dark .playlist-card {
  background: #1a1a1a;
}

.playlist-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-cover {
  position: relative;
  width: 100%;
  padding-top: 100%;
}

.card-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-play {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  opacity: 0;
  transition: all 0.2s ease;
}

.playlist-card:hover .card-play {
  opacity: 1;
}

.card-info {
  padding: 12px;
}

.card-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .card-name {
  color: #fff;
}

.card-desc {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .card-desc {
  color: #666;
}

.songs-section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.dark .songs-section {
  background: #1a1a1a;
}

.songs-table {
  overflow-x: auto;
}

.songs-table table {
  width: 100%;
  border-collapse: collapse;
}

.songs-table th {
  text-align: left;
  padding: 12px 15px;
  font-size: 12px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dark .songs-table th {
  color: #666;
}

.songs-table td {
  padding: 12px 15px;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}

.dark .songs-table td {
  color: #ccc;
  border-bottom-color: #2a2a2a;
}

.songs-table tbody tr:hover {
  background: #f8f8fa;
  cursor: pointer;
}

.dark .songs-table tbody tr:hover {
  background: #222;
}

.songs-table tbody tr.active {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(78, 205, 196, 0.1));
}

.col-index {
  width: 40px;
  font-size: 14px;
  color: #999;
}

.dark .col-index {
  color: #666;
}

.col-title {
  width: 30%;
}

.song-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.song-cover {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
}

.song-detail {
  overflow: hidden;
}

.song-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .song-name {
  color: #fff;
}

.song-artist-small {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.dark .song-artist-small {
  color: #666;
}

.col-artist, .col-album {
  width: 25%;
}

.col-duration {
  width: 10%;
  text-align: right;
  font-size: 13px;
  color: #999;
}

.dark .col-duration {
  color: #666;
}
</style>