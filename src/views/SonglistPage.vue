<template>
  <div class="page songlist-page" :class="{ 'dark': isDarkMode }">
    <div class="page-header">
      <h2 class="page-title">📋 歌单</h2>
      <p class="page-subtitle">探索精选歌单，发现更多好音乐</p>
    </div>

    <div class="content-area">
      <div class="filter-bar">
        <button 
          v-for="filter in filters" 
          :key="filter.id"
          :class="{ active: activeFilter === filter.id }"
          class="filter-btn"
          @click="activeFilter = filter.id"
        >
          {{ filter.name }}
        </button>
      </div>

      <div class="playlist-grid">
        <div 
          v-for="(playlist, index) in filteredPlaylists" 
          :key="index"
          class="playlist-card-large"
          @click="openPlaylist(playlist)"
        >
          <div class="card-cover">
            <img :src="playlist.cover" :alt="playlist.name" />
            <div class="card-overlay">
              <div class="play-icon">▶</div>
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ playlist.name }}</h3>
            <p class="card-desc">{{ playlist.desc }}</p>
            <div class="card-meta">
              <span class="meta-item">🎵 {{ playlist.songCount }} 首</span>
              <span class="meta-item">👥 {{ playlist.followers }} 人关注</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="selectedPlaylist" class="playlist-detail">
        <div class="detail-header">
          <img :src="selectedPlaylist.cover" class="detail-cover" />
          <div class="detail-info">
            <h2 class="detail-title">{{ selectedPlaylist.name }}</h2>
            <p class="detail-desc">{{ selectedPlaylist.desc }}</p>
            <div class="detail-meta">
              <span>{{ selectedPlaylist.songCount }} 首歌曲</span>
              <span>{{ selectedPlaylist.followers }} 人关注</span>
            </div>
            <button class="btn-play-all" @click="playAllSongs">▶ 播放全部</button>
          </div>
        </div>
        <div class="detail-songs">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>歌曲</th>
                <th>歌手</th>
                <th>专辑</th>
                <th>时长</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(song, index) in selectedPlaylist.songs" 
                :key="index"
                :class="{ active: currentIndex === getOriginalIndex(song.id) }"
                @click="playSong(getOriginalIndex(song.id))"
              >
                <td>{{ index + 1 }}</td>
                <td>
                  <div class="song-info">
                    <img v-if="song.cover" :src="song.cover" class="mini-cover" />
                    <div>
                      <div class="song-name">{{ song.name }}</div>
                      <div class="song-artist">{{ song.artist }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ song.artist }}</td>
                <td>{{ song.album }}</td>
                <td>{{ formatDuration(song.duration) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useMusicStore } from '../stores/musicStore';
import { demoPlaylist } from '../utils/demoData';
import { formatDuration } from '../utils/format';

const { playlist, currentIndex, isDarkMode, addSongs, playSong } = useMusicStore();

const activeFilter = ref('all');
const selectedPlaylist = ref(null);

const filters = [
  { id: 'all', name: '全部' },
  { id: 'recommend', name: '推荐' },
  { id: 'pop', name: '流行' },
  { id: 'classical', name: '古典' },
  { id: 'electronic', name: '电子' }
];

const allPlaylists = ref([
  {
    id: '1',
    name: '周杰伦精选合集',
    desc: '收录周杰伦最经典的歌曲，带你重温青春记忆',
    cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=jay%20chou%20album%20cover%20pop%20music%20star&image_size=square',
    songCount: 50,
    followers: 125800,
    songs: demoPlaylist.slice(0, 5)
  },
  {
    id: '2',
    name: '治愈系轻音乐',
    desc: '放松心情，舒缓压力，适合工作学习时聆听',
    cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=healing%20music%20peaceful%20nature%20forest&image_size=square',
    songCount: 30,
    followers: 89200,
    songs: demoPlaylist.slice(0, 3)
  },
  {
    id: '3',
    name: '欧美流行榜',
    desc: 'Billboard热门单曲，感受全球流行音乐潮流',
    cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=billboard%20top%20chart%20music%20neon%20pop&image_size=square',
    songCount: 40,
    followers: 156000,
    songs: demoPlaylist.slice(0, 4)
  },
  {
    id: '4',
    name: '电子舞曲派对',
    desc: '动感节奏，点燃派对氛围',
    cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=electronic%20dance%20music%20neon%20disco&image_size=square',
    songCount: 35,
    followers: 67500,
    songs: demoPlaylist.slice(0, 4)
  },
  {
    id: '5',
    name: '古典音乐精选',
    desc: '贝多芬、莫扎特等大师经典作品',
    cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=classical%20music%20piano%20orchestra%20elegant&image_size=square',
    songCount: 25,
    followers: 45200,
    songs: demoPlaylist.slice(0, 3)
  },
  {
    id: '6',
    name: '华语经典老歌',
    desc: '重温那些年陪伴我们的经典旋律',
    cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=chinese%20classic%20music%20nostalgic%20vintage&image_size=square',
    songCount: 45,
    followers: 98600,
    songs: demoPlaylist.slice(0, 5)
  }
]);

const filteredPlaylists = computed(() => {
  if (activeFilter.value === 'all') return allPlaylists.value;
  return allPlaylists.value;
});

function getOriginalIndex(songId) {
  const index = playlist.value.findIndex(s => s.id === songId);
  if (index >= 0) return index;
  return -1;
}

function openPlaylist(playlist) {
  selectedPlaylist.value = playlist;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function playAllSongs() {
  if (selectedPlaylist.value) {
    addSongs(selectedPlaylist.value.songs);
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f7;
  padding: 20px;
  transition: all 0.3s ease;
}

.page.dark {
  background: #121212;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin: 0 0 10px;
}

.dark .page-title {
  color: #fff;
}

.page-subtitle {
  font-size: 16px;
  color: #999;
  margin: 0;
}

.dark .page-subtitle {
  color: #666;
}

.content-area {
  max-width: 1200px;
  margin: 0 auto;
}

.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  overflow-x: auto;
}

.filter-btn {
  padding: 8px 20px;
  border: 1px solid #e8e8e8;
  background: #fff;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dark .filter-btn {
  background: #1a1a1a;
  border-color: #333;
  color: #999;
}

.filter-btn:hover {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.filter-btn.active {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  border-color: transparent;
  color: #fff;
}

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.playlist-card-large {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.2s ease;
}

.dark .playlist-card-large {
  background: #1a1a1a;
}

.playlist-card-large:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-cover {
  position: relative;
  width: 100%;
  padding-top: 60%;
}

.card-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.playlist-card-large:hover .card-overlay {
  opacity: 1;
}

.play-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 107, 107, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
}

.card-content {
  padding: 15px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px;
}

.dark .card-title {
  color: #fff;
}

.card-desc {
  font-size: 13px;
  color: #999;
  margin: 0 0 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dark .card-desc {
  color: #666;
}

.card-meta {
  display: flex;
  gap: 15px;
}

.meta-item {
  font-size: 12px;
  color: #999;
}

.dark .meta-item {
  color: #666;
}

.playlist-detail {
  margin-top: 40px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.dark .playlist-detail {
  background: #1a1a1a;
}

.detail-header {
  display: flex;
  gap: 25px;
  padding: 30px;
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(78, 205, 196, 0.1));
}

.detail-cover {
  width: 150px;
  height: 150px;
  border-radius: 8px;
  object-fit: cover;
}

.detail-info {
  flex: 1;
}

.detail-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0 0 10px;
}

.dark .detail-title {
  color: #fff;
}

.detail-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 15px;
}

.dark .detail-desc {
  color: #999;
}

.detail-meta {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #999;
  margin-bottom: 20px;
}

.btn-play-all {
  padding: 10px 30px;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  border: none;
  border-radius: 30px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-play-all:hover {
  transform: scale(1.05);
}

.detail-songs {
  padding: 20px;
}

.detail-songs table {
  width: 100%;
  border-collapse: collapse;
}

.detail-songs th {
  text-align: left;
  padding: 12px 15px;
  font-size: 12px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dark .detail-songs th {
  color: #666;
}

.detail-songs td {
  padding: 12px 15px;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}

.dark .detail-songs td {
  color: #ccc;
  border-bottom-color: #2a2a2a;
}

.detail-songs tbody tr:hover {
  background: #f8f8fa;
  cursor: pointer;
}

.dark .detail-songs tbody tr:hover {
  background: #222;
}

.detail-songs tbody tr.active {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(78, 205, 196, 0.1));
}

.song-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mini-cover {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
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
}
</style>