<template>
  <div class="local-music-settings">
    <div class="setting-group">
      <div class="setting-label">
        <span class="label-icon">📁</span>
        <span class="label-text">音乐文件夹</span>
      </div>
      <div class="folder-list">
        <div 
          v-for="(folder, index) in musicFolders" 
          :key="index"
          class="folder-item"
        >
          <span class="folder-icon">📂</span>
          <span class="folder-path">{{ folder }}</span>
          <button class="btn-remove" @click="removeFolder(index)">✕</button>
        </div>
        <div v-if="musicFolders.length === 0" class="empty-folders">
          <span class="empty-text">暂无添加的音乐文件夹</span>
        </div>
      </div>
      <button class="btn-add-folder" @click="addFolder">
        <span class="add-icon">+</span>
        <span>添加音乐文件夹</span>
      </button>
    </div>

    <div class="setting-group">
      <div class="setting-label">
        <span class="label-icon">🔍</span>
        <span class="label-text">扫描设置</span>
      </div>
      <div class="scan-options">
        <div class="scan-item">
          <span class="scan-name">自动扫描新音乐</span>
          <button 
            :class="{ active: autoScan }"
            class="toggle-btn"
            @click="autoScan = !autoScan"
          >
            {{ autoScan ? '开启' : '关闭' }}
          </button>
        </div>
        <div class="scan-item">
          <span class="scan-name">扫描深度</span>
          <select v-model="scanDepth" class="select-input">
            <option value="1">仅当前目录</option>
            <option value="2">包含子目录</option>
            <option value="3">包含二级子目录</option>
            <option value="-1">全部子目录</option>
          </select>
        </div>
      </div>
    </div>

    <div class="setting-group">
      <div class="setting-label">
        <span class="label-icon">📄</span>
        <span class="label-text">支持的格式</span>
      </div>
      <div class="format-list">
        <span 
          v-for="format in supportedFormats" 
          :key="format"
          :class="{ active: enabledFormats.includes(format) }"
          class="format-tag"
          @click="toggleFormat(format)"
        >
          {{ format }}
        </span>
      </div>
    </div>

    <div class="setting-group">
      <div class="setting-label">
        <span class="label-icon">📊</span>
        <span class="label-text">本地音乐统计</span>
      </div>
      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-number">{{ localStats.totalSongs }}</div>
          <div class="stat-desc">总歌曲数</div>
        </div>
        <div class="stat-box">
          <div class="stat-number">{{ localStats.totalSize }}</div>
          <div class="stat-desc">总大小</div>
        </div>
        <div class="stat-box">
          <div class="stat-number">{{ localStats.lastScan }}</div>
          <div class="stat-desc">上次扫描</div>
        </div>
      </div>
    </div>

    <div class="actions-row">
      <button class="btn-scan" @click="scanMusic">
        <span class="scan-icon">🔄</span>
        <span>扫描音乐</span>
      </button>
    </div>

    <div class="actions">
      <button class="btn-reset" @click="resetSettings">重置默认</button>
      <button class="btn-save" @click="saveSettings">保存设置</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { open } from '@tauri-apps/plugin-dialog';

const emit = defineEmits(['close']);

const musicFolders = ref([]);
const autoScan = ref(true);
const scanDepth = ref('-1');
const enabledFormats = ref(['mp3', 'flac', 'wav', 'm4a', 'ogg']);

const supportedFormats = ['mp3', 'flac', 'wav', 'm4a', 'ogg', 'aac', 'wma', 'ape'];

const localStats = ref({
  totalSongs: 0,
  totalSize: '0 MB',
  lastScan: '从未'
});

// 加载保存的设置
const savedSettings = localStorage.getItem('localMusicSettings');
if (savedSettings) {
  const settings = JSON.parse(savedSettings);
  musicFolders.value = settings.musicFolders || [];
  autoScan.value = settings.autoScan || true;
  scanDepth.value = settings.scanDepth || '-1';
  enabledFormats.value = settings.enabledFormats || ['mp3', 'flac', 'wav', 'm4a', 'ogg'];
  if (settings.localStats) {
    localStats.value = settings.localStats;
  }
}

async function addFolder() {
  const selected = await open({
    directory: true,
    multiple: false
  });
  
  if (selected && !musicFolders.value.includes(selected)) {
    musicFolders.value.push(selected);
  }
}

function removeFolder(index) {
  musicFolders.value.splice(index, 1);
}

function toggleFormat(format) {
  const index = enabledFormats.value.indexOf(format);
  if (index >= 0) {
    enabledFormats.value.splice(index, 1);
  } else {
    enabledFormats.value.push(format);
  }
}

function scanMusic() {
  // 模拟扫描过程
  localStats.value.totalSongs = Math.floor(Math.random() * 100) + 50;
  localStats.value.totalSize = `${Math.floor(Math.random() * 500) + 100} MB`;
  localStats.value.lastScan = '刚刚';
}

function resetSettings() {
  musicFolders.value = [];
  autoScan.value = true;
  scanDepth.value = '-1';
  enabledFormats.value = ['mp3', 'flac', 'wav', 'm4a', 'ogg'];
  localStats.value = {
    totalSongs: 0,
    totalSize: '0 MB',
    lastScan: '从未'
  };
}

function saveSettings() {
  const settings = {
    musicFolders: musicFolders.value,
    autoScan: autoScan.value,
    scanDepth: scanDepth.value,
    enabledFormats: enabledFormats.value,
    localStats: localStats.value
  };
  
  localStorage.setItem('localMusicSettings', JSON.stringify(settings));
  emit('close');
}
</script>

<style scoped>
.local-music-settings {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 10px;
}

.label-icon {
  font-size: 18px;
}

.label-text {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.dark .label-text {
  color: #fff;
}

.folder-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.folder-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #f5f5f7;
  border-radius: 8px;
}

.dark .folder-item {
  background: #222;
}

.folder-icon {
  font-size: 16px;
}

.folder-path {
  flex: 1;
  font-size: 13px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dark .folder-path {
  color: #999;
}

.btn-remove {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: #ccc;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-remove:hover {
  background: #ff6b6b;
  color: #fff;
}

.empty-folders {
  padding: 20px;
  text-align: center;
}

.empty-text {
  font-size: 13px;
  color: #999;
}

.dark .empty-text {
  color: #666;
}

.btn-add-folder {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: 1px dashed #e8e8e8;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dark .btn-add-folder {
  border-color: #333;
  color: #999;
}

.btn-add-folder:hover {
  border-color: #ff6b6b;
  color: #ff6b6b;
  border-style: solid;
}

.add-icon {
  font-size: 18px;
  font-weight: bold;
}

.scan-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.scan-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.scan-name {
  font-size: 14px;
  color: #333;
}

.dark .scan-name {
  color: #ccc;
}

.toggle-btn {
  padding: 6px 14px;
  border: 1px solid #e8e8e8;
  background: #fff;
  border-radius: 6px;
  font-size: 12px;
  color: #999;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dark .toggle-btn {
  background: #2a2a2a;
  border-color: #333;
  color: #666;
}

.toggle-btn:hover {
  border-color: #ff6b6b;
}

.toggle-btn.active {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  border-color: transparent;
  color: #fff;
}

.select-input {
  padding: 6px 12px;
  border: 1px solid #e8e8e8;
  background: #fff;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  outline: none;
}

.dark .select-input {
  background: #2a2a2a;
  border-color: #333;
  color: #999;
}

.format-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.format-tag {
  padding: 6px 12px;
  border: 1px solid #e8e8e8;
  background: #fff;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dark .format-tag {
  background: #2a2a2a;
  border-color: #333;
  color: #999;
}

.format-tag:hover {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.format-tag.active {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  border-color: transparent;
  color: #fff;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.stat-box {
  padding: 15px;
  background: #f5f5f7;
  border-radius: 8px;
  text-align: center;
}

.dark .stat-box {
  background: #222;
}

.stat-number {
  font-size: 20px;
  font-weight: 700;
  color: #ff6b6b;
  margin-bottom: 5px;
}

.stat-desc {
  font-size: 12px;
  color: #999;
}

.dark .stat-desc {
  color: #666;
}

.actions-row {
  display: flex;
  justify-content: center;
}

.btn-scan {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 30px;
  border: none;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  border-radius: 8px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-scan:hover {
  transform: scale(1.05);
}

.scan-icon {
  font-size: 16px;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  padding-top: 15px;
  border-top: 1px solid #e8e8e8;
}

.dark .actions {
  border-top-color: #2a2a2a;
}

.btn-reset {
  padding: 10px 20px;
  border: 1px solid #e8e8e8;
  background: #fff;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dark .btn-reset {
  background: #2a2a2a;
  border-color: #333;
  color: #999;
}

.btn-reset:hover {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.btn-save {
  padding: 10px 20px;
  border: none;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  border-radius: 8px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-save:hover {
  transform: scale(1.05);
}
</style>