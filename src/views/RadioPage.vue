<template>
  <div class="page radio-page" :class="{ 'dark': isDarkMode }">
    <div class="page-header">
      <h2 class="page-title">📻 电台</h2>
      <p class="page-subtitle">探索各种类型的电台频道</p>
    </div>

    <div class="content-area">
      <div class="featured-radio">
        <div class="featured-card">
          <div class="featured-bg" :style="{ backgroundImage: `url(${featuredRadio.cover})` }"></div>
          <div class="featured-overlay"></div>
          <div class="featured-content">
            <div class="featured-badge">精选推荐</div>
            <h3 class="featured-title">{{ featuredRadio.name }}</h3>
            <p class="featured-desc">{{ featuredRadio.desc }}</p>
            <button class="btn-play-featured" @click="playRadio(featuredRadio)">
              ▶ 立即收听
            </button>
          </div>
        </div>
      </div>

      <div class="radio-categories">
        <h3 class="section-title">电台分类</h3>
        <div class="category-grid">
          <div 
            v-for="category in categories" 
            :key="category.id"
            class="category-card"
            :class="{ active: activeCategory === category.id }"
            @click="activeCategory = category.id"
          >
            <span class="category-icon">{{ category.icon }}</span>
            <span class="category-name">{{ category.name }}</span>
          </div>
        </div>
      </div>

      <div class="radio-list">
        <h3 class="section-title">{{ currentCategoryName }}电台</h3>
        <div class="radio-grid">
          <div 
            v-for="radio in filteredRadios" 
            :key="radio.id"
            class="radio-card"
            @click="playRadio(radio)"
          >
            <div class="radio-cover">
              <img :src="radio.cover" :alt="radio.name" />
              <div class="radio-play">
                <span>▶</span>
              </div>
            </div>
            <div class="radio-info">
              <div class="radio-name">{{ radio.name }}</div>
              <div class="radio-desc">{{ radio.desc }}</div>
              <div class="radio-meta">
                <span>🎧 {{ radio.listeners }} 人在听</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useMusicStore } from '../stores/musicStore';

const { isDarkMode } = useMusicStore();

const activeCategory = ref('recommend');

const featuredRadio = ref({
  id: 'featured',
  name: '音乐精选电台',
  desc: '精选全球热门音乐，24小时不间断播放',
  cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=radio%20station%20music%20waves%20colorful%20abstract&image_size=square',
  listeners: 125800
});

const categories = ref([
  { id: 'recommend', name: '推荐', icon: '🔥' },
  { id: 'pop', name: '流行', icon: '🎶' },
  { id: 'classical', name: '古典', icon: '🎻' },
  { id: 'jazz', name: '爵士', icon: '🎷' },
  { id: 'rock', name: '摇滚', icon: '🤘' },
  { id: 'electronic', name: '电子', icon: '⚡' },
  { id: 'folk', name: '民谣', icon: '🎸' },
  { id: 'sleep', name: '助眠', icon: '🌙' }
]);

const allRadios = ref([
  {
    id: '1',
    name: '华语金曲榜',
    desc: '华语乐坛经典歌曲回顾',
    cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=chinese%20pop%20music%20golden%20classic&image_size=square',
    listeners: 89200,
    category: 'recommend'
  },
  {
    id: '2',
    name: '欧美流行前线',
    desc: 'Billboard热门单曲速递',
    cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=western%20pop%20music%20modern%20neon&image_size=square',
    listeners: 156000,
    category: 'pop'
  },
  {
    id: '3',
    name: '古典音乐殿堂',
    desc: '贝多芬、莫扎特等大师经典',
    cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=classical%20music%20piano%20orchestra%20elegant&image_size=square',
    listeners: 45200,
    category: 'classical'
  },
  {
    id: '4',
    name: '爵士咖啡馆',
    desc: '慵懒爵士，惬意时光',
    cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=jazz%20music%20cafe%20saxophone%20vintage&image_size=square',
    listeners: 32800,
    category: 'jazz'
  },
  {
    id: '5',
    name: '摇滚不死',
    desc: '经典摇滚，热血沸腾',
    cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=rock%20music%20concert%20fire%20energy&image_size=square',
    listeners: 67500,
    category: 'rock'
  },
  {
    id: '6',
    name: '电子狂欢',
    desc: '电音派对，嗨翻全场',
    cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=electronic%20dance%20music%20neon%20party&image_size=square',
    listeners: 98600,
    category: 'electronic'
  },
  {
    id: '7',
    name: '民谣小屋',
    desc: '温暖民谣，治愈心灵',
    cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=folk%20music%20acoustic%20guitar%20cozy&image_size=square',
    listeners: 54300,
    category: 'folk'
  },
  {
    id: '8',
    name: '深度睡眠',
    desc: '白噪音助眠，一夜好眠',
    cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=sleep%20music%20peaceful%20stars%20night&image_size=square',
    listeners: 78900,
    category: 'sleep'
  }
]);

const currentCategoryName = computed(() => {
  const category = categories.value.find(c => c.id === activeCategory.value);
  return category?.name || '';
});

const filteredRadios = computed(() => {
  if (activeCategory.value === 'recommend') {
    return allRadios.value.slice(0, 6);
  }
  return allRadios.value.filter(r => r.category === activeCategory.value);
});

function playRadio(radio) {
  alert(`正在收听：${radio.name}`);
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

.featured-radio {
  margin-bottom: 40px;
}

.featured-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  height: 300px;
}

.featured-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
}

.featured-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.8), rgba(78, 205, 196, 0.8));
}

.featured-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  color: #fff;
}

.featured-badge {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 12px;
  margin-bottom: 15px;
  align-self: flex-start;
}

.featured-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 10px;
}

.featured-desc {
  font-size: 16px;
  opacity: 0.9;
  margin: 0 0 20px;
}

.btn-play-featured {
  align-self: flex-start;
  padding: 12px 30px;
  background: #fff;
  border: none;
  border-radius: 30px;
  color: #ff6b6b;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-play-featured:hover {
  transform: scale(1.05);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px;
}

.dark .section-title {
  color: #fff;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 40px;
}

.category-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 20px;
  background: #fff;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.dark .category-card {
  background: #1a1a1a;
}

.category-card:hover {
  transform: translateY(-2px);
}

.category-card.active {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
}

.category-icon {
  font-size: 20px;
}

.category-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.dark .category-name {
  color: #ccc;
}

.category-card.active .category-name {
  color: #fff;
}

.radio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.radio-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.dark .radio-card {
  background: #1a1a1a;
}

.radio-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.radio-cover {
  position: relative;
  width: 100%;
  padding-top: 60%;
}

.radio-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.radio-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  background: rgba(255, 107, 107, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  opacity: 0;
  transition: all 0.2s ease;
}

.radio-card:hover .radio-play {
  opacity: 1;
}

.radio-info {
  padding: 15px;
}

.radio-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.dark .radio-name {
  color: #fff;
}

.radio-desc {
  font-size: 13px;
  color: #999;
  margin-bottom: 10px;
}

.dark .radio-desc {
  color: #666;
}

.radio-meta {
  font-size: 12px;
  color: #999;
}

.dark .radio-meta {
  color: #666;
}
</style>