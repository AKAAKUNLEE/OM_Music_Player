<template>
  <div class="player-container">
    <!-- 顶部：选择文件按钮 -->
    <div class="header">
      <button class="btn-primary" @click="selectMusicFiles">
        📁 选择本地音乐
      </button>
    </div>

    <!-- 播放列表 -->
    <div class="playlist">
      <h3>播放列表</h3>
      <ul>
        <li
          v-for="(song, index) in playlist"
          :key="index"
          :class="{ active: currentIndex === index }"
          @click="playSong(index)"
        >
          {{ index + 1 }}. {{ song.name }}
        </li>
      </ul>
    </div>

    <!-- 播放控制区 -->
    <div class="controls">
      <div class="song-info">
        <div class="song-name">{{ currentSong?.name || '暂无播放' }}</div>
      </div>

      <!-- 进度条 -->
      <div class="progress-bar">
        <span>{{ formatTime(currentTime) }}</span>
        <input
          type="range"
          min="0"
          :max="duration || 0"
          :value="currentTime"
          @input="seekProgress"
          class="progress"
        />
        <span>{{ formatTime(duration) }}</span>
      </div>

      <!-- 控制按钮 -->
      <div class="control-buttons">
        <button @click="playPrev">⏮ 上一首</button>
        <button class="btn-play" @click="togglePlay">
          {{ isPlaying ? '⏸ 暂停' : '▶ 播放' }}
        </button>
        <button @click="playNext">⏭ 下一首</button>
      </div>

      <!-- 音量控制 -->
      <div class="volume-bar">
        <span>🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          :value="volume"
          @input="changeVolume"
          class="volume"
        />
      </div>
    </div>

    <!-- 隐藏的 audio 元素 -->
    <audio ref="audioRef" @timeupdate="updateTime" @loadedmetadata="onLoaded" @ended="playNext" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { open } from '@tauri-apps/plugin-dialog'
import { convertFileSrc } from '@tauri-apps/api/core'

// 播放状态
const playlist = ref([])       // 播放列表
const currentIndex = ref(-1)   // 当前播放索引
const isPlaying = ref(false)   // 是否正在播放
const currentTime = ref(0)     // 当前播放时间
const duration = ref(0)        // 歌曲总时长
const volume = ref(0.7)        // 音量
const audioRef = ref(null)     // audio DOM引用

// 当前播放歌曲
const currentSong = computed(() => {
  return playlist.value[currentIndex.value] || null
})

// 1. 选择本地音乐文件
async function selectMusicFiles() {
  const selected = await open({
    multiple: true,
    filters: [{
      name: '音频文件',
      extensions: ['mp3', 'flac', 'wav', 'm4a', 'ogg']
    }]
  })

  if (!selected || selected.length === 0) return

  // 处理文件路径，转成播放列表
  const newSongs = selected.map(filePath => {
    const fileName = filePath.split(/[\\/]/).pop() // 提取文件名
    return {
      name: fileName,
      path: filePath,
      url: convertFileSrc(filePath) // 关键：本地路径转WebView可访问的URL
    }
  })

  playlist.value.push(...newSongs)
  // 如果还没播放过，自动播放第一首
  if (currentIndex.value === -1) {
    playSong(0)
  }
}

// 2. 播放指定索引的歌曲
function playSong(index) {
  if (index < 0 || index >= playlist.value.length) return
  currentIndex.value = index
  audioRef.value.src = currentSong.value.url
  audioRef.value.play()
  isPlaying.value = true
}

// 3. 播放/暂停切换
function togglePlay() {
  if (!currentSong.value) return
  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }
  isPlaying.value = !isPlaying.value
}

// 4. 上一首/下一首
function playPrev() {
  let newIndex = currentIndex.value - 1
  if (newIndex < 0) newIndex = playlist.value.length - 1
  playSong(newIndex)
}

function playNext() {
  let newIndex = currentIndex.value + 1
  if (newIndex >= playlist.value.length) newIndex = 0
  playSong(newIndex)
}

// 5. 进度更新与拖动
function updateTime() {
  currentTime.value = audioRef.value.currentTime
}

function onLoaded() {
  duration.value = audioRef.value.duration
}

function seekProgress(e) {
  const time = parseFloat(e.target.value)
  audioRef.value.currentTime = time
  currentTime.value = time
}

// 6. 音量控制
function changeVolume(e) {
  const vol = parseFloat(e.target.value)
  audioRef.value.volume = vol
  volume.value = vol
}

// 7. 时间格式化（秒转分:秒）
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '00:00'
  const min = Math.floor(seconds / 60).toString().padStart(2, '0')
  const sec = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${min}:${sec}`
}

// 初始化设置音量
onMounted(() => {
  audioRef.value.volume = volume.value
})
</script>

<style scoped>
.player-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  background: #f5f5f7;
  font-family: system-ui, -apple-system, sans-serif;
}

.header {
  margin-bottom: 20px;
}

.btn-primary {
  padding: 10px 20px;
  background: #007aff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}
.btn-primary:hover {
  background: #0066d6;
}

.playlist {
  flex: 1;
  overflow-y: auto;
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.playlist h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #333;
}

.playlist ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.playlist li {
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #555;
  margin-bottom: 4px;
}

.playlist li:hover {
  background: #f0f0f5;
}

.playlist li.active {
  background: #e6f0ff;
  color: #007aff;
  font-weight: 500;
}

.controls {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.song-info {
  text-align: center;
  margin-bottom: 16px;
}

.song-name {
  font-size: 18px;
  font-weight: 500;
  color: #222;
}

.progress-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  font-size: 12px;
  color: #666;
}

.progress {
  flex: 1;
  accent-color: #007aff;
}

.control-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 16px;
}

.control-buttons button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.control-buttons button:hover {
  background: #f8f8fa;
}

.btn-play {
  background: #007aff !important;
  color: white;
  border-color: #007aff !important;
  padding: 8px 24px !important;
}

.volume-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
}

.volume {
  width: 120px;
  accent-color: #007aff;
}
</style>