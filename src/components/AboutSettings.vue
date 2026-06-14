<template>
  <div class="about-settings">
    <div class="app-info">
      <div class="app-logo">🎵</div>
      <h2 class="app-name">OM Music Player</h2>
      <p class="app-version">版本 1.0.0</p>
      <p class="app-desc">一款简洁优雅的本地音乐播放器</p>
    </div>

    <div class="info-section">
      <h3 class="section-title">✨ 功能特性</h3>
      <div class="feature-list">
        <div class="feature-item">
          <span class="feature-icon">🎵</span>
          <span class="feature-text">支持多种音频格式（MP3、FLAC、WAV等）</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🎨</span>
          <span class="feature-text">深色/浅色主题切换</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">📝</span>
          <span class="feature-text">歌词同步显示</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">📊</span>
          <span class="feature-text">音效均衡器调节</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">📁</span>
          <span class="feature-text">本地音乐文件管理</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🎧</span>
          <span class="feature-text">播放列表管理</span>
        </div>
      </div>
    </div>

    <div class="info-section">
      <h3 class="section-title">💻 技术栈</h3>
      <div class="tech-tags">
        <span class="tech-tag">Vue 3</span>
        <span class="tech-tag">Tauri 2</span>
        <span class="tech-tag">TypeScript</span>
        <span class="tech-tag">Vite</span>
      </div>
    </div>

    <div class="info-section">
      <h3 class="section-title">📞 联系我们</h3>
      <div class="contact-list">
        <div class="contact-item" @click="openLink('github')">
          <span class="contact-icon">📦</span>
          <span class="contact-name">GitHub</span>
          <span class="contact-arrow">→</span>
        </div>
        <div class="contact-item" @click="openLink('feedback')">
          <span class="contact-icon">💬</span>
          <span class="contact-name">问题反馈</span>
          <span class="contact-arrow">→</span>
        </div>
        <div class="contact-item" @click="openLink('website')">
          <span class="contact-icon">🌐</span>
          <span class="contact-name">官方网站</span>
          <span class="contact-arrow">→</span>
        </div>
      </div>
    </div>

    <div class="info-section">
      <h3 class="section-title">📜 法律信息</h3>
      <div class="legal-list">
        <div class="legal-item" @click="showTerms = true">
          <span class="legal-name">用户协议</span>
          <span class="legal-arrow">→</span>
        </div>
        <div class="legal-item" @click="showPrivacyPolicy = true">
          <span class="legal-name">隐私政策</span>
          <span class="legal-arrow">→</span>
        </div>
        <div class="legal-item" @click="showLicense = true">
          <span class="legal-name">开源许可证</span>
          <span class="legal-arrow">→</span>
        </div>
      </div>
    </div>

    <div class="copyright">
      <p class="copyright-text">© 2024 OM Music Player</p>
      <p class="copyright-text">Made with ❤️ for music lovers</p>
    </div>

    <!-- 用户协议弹窗 -->
    <div v-if="showTerms" class="legal-modal" @click.self="showTerms = false">
      <div class="legal-modal-content" :class="{ 'dark': isDarkMode }">
        <h4 class="legal-modal-title">用户协议</h4>
        <div class="legal-text">
          <p>欢迎使用 OM Music Player！</p>
          <p>在使用本软件前，请仔细阅读以下条款：</p>
          <p>1. 本软件仅供个人非商业用途使用。</p>
          <p>2. 用户需自行确保所播放音乐文件的合法性。</p>
          <p>3. 本软件不提供任何在线音乐服务，仅作为本地播放工具。</p>
          <p>4. 用户应遵守当地法律法规，不得利用本软件从事违法活动。</p>
          <p>5. 本软件开发者不对因使用本软件而产生的任何损失承担责任。</p>
        </div>
        <button class="btn-close-legal" @click="showTerms = false">关闭</button>
      </div>
    </div>

    <!-- 隐私政策弹窗 -->
    <div v-if="showPrivacyPolicy" class="legal-modal" @click.self="showPrivacyPolicy = false">
      <div class="legal-modal-content" :class="{ 'dark': isDarkMode }">
        <h4 class="legal-modal-title">隐私政策</h4>
        <div class="legal-text">
          <p>我们重视您的隐私保护：</p>
          <p>1. 本软件所有数据均存储在本地，不上传至任何服务器。</p>
          <p>2. 用户设置、播放记录等信息均保存在本地浏览器存储中。</p>
          <p>3. 本软件不会收集任何用户个人信息。</p>
          <p>4. 本软件不会追踪用户行为或发送任何数据到外部服务器。</p>
          <p>5. 用户可随时清除本地存储的数据。</p>
        </div>
        <button class="btn-close-legal" @click="showPrivacyPolicy = false">关闭</button>
      </div>
    </div>

    <!-- 开源许可证弹窗 -->
    <div v-if="showLicense" class="legal-modal" @click.self="showLicense = false">
      <div class="legal-modal-content" :class="{ 'dark': isDarkMode }">
        <h4 class="legal-modal-title">开源许可证</h4>
        <div class="legal-text">
          <p>本软件基于以下开源项目构建：</p>
          <p>• Vue 3 - MIT License</p>
          <p>• Tauri - Apache 2.0 License</p>
          <p>• Vite - MIT License</p>
          <p>• TypeScript - Apache 2.0 License</p>
          <p>感谢所有开源社区的贡献者！</p>
        </div>
        <button class="btn-close-legal" @click="showLicense = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMusicStore } from '../stores/musicStore';

const emit = defineEmits(['close']);
const { isDarkMode } = useMusicStore();

const showTerms = ref(false);
const showPrivacyPolicy = ref(false);
const showLicense = ref(false);

function openLink(type) {
  const links = {
    github: 'https://github.com',
    feedback: 'https://github.com/issues',
    website: 'https://om-music-player.example.com'
  };
  
  alert(`即将打开: ${links[type]}`);
}
</script>

<style scoped>
.about-settings {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.app-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(78, 205, 196, 0.1));
  border-radius: 12px;
}

.app-logo {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin-bottom: 15px;
}

.app-name {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 5px;
}

.dark .app-name {
  color: #fff;
}

.app-version {
  font-size: 14px;
  color: #999;
  margin: 0 0 10px;
}

.dark .app-version {
  color: #666;
}

.app-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.dark .app-desc {
  color: #999;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.dark .section-title {
  color: #fff;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: #f5f5f7;
  border-radius: 8px;
}

.dark .feature-item {
  background: #222;
}

.feature-icon {
  font-size: 18px;
}

.feature-text {
  font-size: 14px;
  color: #666;
}

.dark .feature-text {
  color: #999;
}

.tech-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tech-tag {
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(78, 205, 196, 0.1));
  border-radius: 8px;
  font-size: 13px;
  color: #ff6b6b;
  font-weight: 500;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f5f7;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dark .contact-item {
  background: #222;
}

.contact-item:hover {
  background: #e8e8e8;
}

.dark .contact-item:hover {
  background: #2a2a2a;
}

.contact-icon {
  font-size: 18px;
}

.contact-name {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.dark .contact-name {
  color: #ccc;
}

.contact-arrow {
  color: #ccc;
}

.legal-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legal-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #f5f5f7;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dark .legal-item {
  background: #222;
}

.legal-item:hover {
  background: #e8e8e8;
}

.dark .legal-item:hover {
  background: #2a2a2a;
}

.legal-name {
  font-size: 14px;
  color: #333;
}

.dark .legal-name {
  color: #ccc;
}

.legal-arrow {
  color: #ccc;
}

.copyright {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.dark .copyright {
  border-top-color: #2a2a2a;
}

.copyright-text {
  font-size: 12px;
  color: #999;
  margin: 0;
  line-height: 1.8;
}

.dark .copyright-text {
  color: #666;
}

/* Legal Modal */
.legal-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
}

.legal-modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  max-height: 70vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.legal-modal-content.dark {
  background: #1a1a1a;
}

.legal-modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px;
  text-align: center;
}

.dark .legal-modal-title {
  color: #fff;
}

.legal-text {
  flex: 1;
  overflow-y: auto;
  font-size: 14px;
  color: #666;
  line-height: 1.8;
}

.dark .legal-text {
  color: #999;
}

.legal-text p {
  margin: 0 0 10px;
}

.btn-close-legal {
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  border-radius: 8px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-close-legal:hover {
  transform: scale(1.05);
}
</style>