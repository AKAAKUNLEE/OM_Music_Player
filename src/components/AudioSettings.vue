<template>
  <div class="audio-settings">
    <div class="setting-group">
      <div class="setting-label">
        <span class="label-icon">🔊</span>
        <span class="label-text">主音量</span>
      </div>
      <div class="setting-control">
        <input 
          type="range" 
          min="0" 
          max="100" 
          v-model="masterVolume"
          class="slider"
        />
        <span class="volume-value">{{ masterVolume }}%</span>
      </div>
    </div>

    <div class="setting-group">
      <div class="setting-label">
        <span class="label-icon">🎵</span>
        <span class="label-text">均衡器</span>
      </div>
      <div class="equalizer-presets">
        <button 
          v-for="preset in eqPresets" 
          :key="preset.id"
          :class="{ active: activePreset === preset.id }"
          class="preset-btn"
          @click="selectPreset(preset.id)"
        >
          {{ preset.name }}
        </button>
      </div>
      <div class="equalizer-bars">
        <div v-for="(band, index) in eqBands" :key="index" class="eq-band">
          <input 
            type="range" 
            min="-12" 
            max="12" 
            v-model="band.value"
            class="eq-slider"
            orient="vertical"
          />
          <span class="band-label">{{ band.label }}</span>
        </div>
      </div>
    </div>

    <div class="setting-group">
      <div class="setting-label">
        <span class="label-icon">🎧</span>
        <span class="label-text">音效增强</span>
      </div>
      <div class="toggle-options">
        <div class="toggle-item">
          <span class="toggle-name">环绕声</span>
          <button 
            :class="{ active: surroundEnabled }"
            class="toggle-btn"
            @click="surroundEnabled = !surroundEnabled"
          >
            {{ surroundEnabled ? '开启' : '关闭' }}
          </button>
        </div>
        <div class="toggle-item">
          <span class="toggle-name">低音增强</span>
          <button 
            :class="{ active: bassBoostEnabled }"
            class="toggle-btn"
            @click="bassBoostEnabled = !bassBoostEnabled"
          >
            {{ bassBoostEnabled ? '开启' : '关闭' }}
          </button>
        </div>
        <div class="toggle-item">
          <span class="toggle-name">音量平衡</span>
          <button 
            :class="{ active: volumeNormalize }"
            class="toggle-btn"
            @click="volumeNormalize = !volumeNormalize"
          >
            {{ volumeNormalize ? '开启' : '关闭' }}
          </button>
        </div>
      </div>
    </div>

    <div class="setting-group">
      <div class="setting-label">
        <span class="label-icon">⏱️</span>
        <span class="label-text">淡入淡出</span>
      </div>
      <div class="fade-control">
        <div class="fade-item">
          <span class="fade-name">淡入时间</span>
          <select v-model="fadeInTime" class="select-input">
            <option value="0">无</option>
            <option value="1">1秒</option>
            <option value="2">2秒</option>
            <option value="3">3秒</option>
            <option value="5">5秒</option>
          </select>
        </div>
        <div class="fade-item">
          <span class="fade-name">淡出时间</span>
          <select v-model="fadeOutTime" class="select-input">
            <option value="0">无</option>
            <option value="1">1秒</option>
            <option value="2">2秒</option>
            <option value="3">3秒</option>
            <option value="5">5秒</option>
          </select>
        </div>
      </div>
    </div>

    <div class="actions">
      <button class="btn-reset" @click="resetSettings">重置默认</button>
      <button class="btn-save" @click="saveSettings">保存设置</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useMusicStore } from '../stores/musicStore';

const emit = defineEmits(['close']);
const { volume } = useMusicStore();

const masterVolume = ref(80);
const activePreset = ref('normal');
const surroundEnabled = ref(false);
const bassBoostEnabled = ref(false);
const volumeNormalize = ref(true);
const fadeInTime = ref('2');
const fadeOutTime = ref('2');

const eqPresets = [
  { id: 'normal', name: '正常' },
  { id: 'pop', name: '流行' },
  { id: 'rock', name: '摇滚' },
  { id: 'classical', name: '古典' },
  { id: 'jazz', name: '爵士' },
  { id: 'electronic', name: '电子' },
  { id: 'custom', name: '自定义' }
];

const eqBands = ref([
  { label: '60Hz', value: 0 },
  { label: '150Hz', value: 0 },
  { label: '400Hz', value: 0 },
  { label: '1kHz', value: 0 },
  { label: '2.4kHz', value: 0 },
  { label: '6kHz', value: 0 },
  { label: '15kHz', value: 0 }
]);

// 加载保存的设置
const savedSettings = localStorage.getItem('audioSettings');
if (savedSettings) {
  const settings = JSON.parse(savedSettings);
  masterVolume.value = settings.masterVolume || 80;
  activePreset.value = settings.activePreset || 'normal';
  surroundEnabled.value = settings.surroundEnabled || false;
  bassBoostEnabled.value = settings.bassBoostEnabled || false;
  volumeNormalize.value = settings.volumeNormalize || true;
  fadeInTime.value = settings.fadeInTime || '2';
  fadeOutTime.value = settings.fadeOutTime || '2';
  if (settings.eqBands) {
    eqBands.value = settings.eqBands;
  }
}

function selectPreset(presetId) {
  activePreset.value = presetId;
  
  // 应用预设值
  const presetValues = {
    normal: [0, 0, 0, 0, 0, 0, 0],
    pop: [2, 4, 2, 0, -1, -1, 0],
    rock: [4, 3, 1, -1, 2, 4, 3],
    classical: [3, 2, 1, 0, 2, 3, 4],
    jazz: [2, 3, 2, 2, 1, 2, 3],
    electronic: [4, 3, 0, -1, 2, 4, 4],
    custom: eqBands.value.map(b => b.value)
  };
  
  if (presetValues[presetId]) {
    eqBands.value.forEach((band, index) => {
      band.value = presetValues[presetId][index];
    });
  }
}

function resetSettings() {
  masterVolume.value = 80;
  activePreset.value = 'normal';
  surroundEnabled.value = false;
  bassBoostEnabled.value = false;
  volumeNormalize.value = true;
  fadeInTime.value = '2';
  fadeOutTime.value = '2';
  eqBands.value.forEach(band => band.value = 0);
}

function saveSettings() {
  const settings = {
    masterVolume: masterVolume.value,
    activePreset: activePreset.value,
    surroundEnabled: surroundEnabled.value,
    bassBoostEnabled: bassBoostEnabled.value,
    volumeNormalize: volumeNormalize.value,
    fadeInTime: fadeInTime.value,
    fadeOutTime: fadeOutTime.value,
    eqBands: eqBands.value
  };
  
  localStorage.setItem('audioSettings', JSON.stringify(settings));
  
  // 更新全局音量
  volume.value = masterVolume.value / 100;
  
  emit('close');
}
</script>

<style scoped>
.audio-settings {
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

.setting-control {
  display: flex;
  align-items: center;
  gap: 15px;
}

.slider {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: #e8e8e8;
  border-radius: 3px;
  outline: none;
}

.dark .slider {
  background: #2a2a2a;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  border-radius: 50%;
  cursor: pointer;
}

.volume-value {
  font-size: 14px;
  color: #999;
  min-width: 40px;
}

.dark .volume-value {
  color: #666;
}

.equalizer-presets {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.preset-btn {
  padding: 6px 12px;
  border: 1px solid #e8e8e8;
  background: #fff;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dark .preset-btn {
  background: #2a2a2a;
  border-color: #333;
  color: #999;
}

.preset-btn:hover {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.preset-btn.active {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  border-color: transparent;
  color: #fff;
}

.equalizer-bars {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 15px 10px;
  background: #f5f5f7;
  border-radius: 8px;
}

.dark .equalizer-bars {
  background: #222;
}

.eq-band {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.eq-slider {
  width: 30px;
  height: 80px;
  -webkit-appearance: slider-vertical;
  appearance: slider-vertical;
  writing-mode: bt-lr;
  background: #e8e8e8;
  border-radius: 3px;
}

.dark .eq-slider {
  background: #333;
}

.band-label {
  font-size: 10px;
  color: #999;
}

.dark .band-label {
  color: #666;
}

.toggle-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toggle-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.toggle-name {
  font-size: 14px;
  color: #333;
}

.dark .toggle-name {
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

.fade-control {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fade-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fade-name {
  font-size: 14px;
  color: #333;
}

.dark .fade-name {
  color: #ccc;
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