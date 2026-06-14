<template>
  <div class="account-settings">
    <div class="profile-section">
      <div class="avatar-wrapper">
        <div class="avatar">{{ userProfile.avatar }}</div>
        <button class="btn-change-avatar" @click="changeAvatar">更换头像</button>
      </div>
      <div class="profile-info">
        <div class="info-row">
          <label class="info-label">昵称</label>
          <input 
            type="text" 
            v-model="userProfile.nickname"
            class="info-input"
            placeholder="请输入昵称"
            maxlength="20"
          />
        </div>
        <div class="info-row">
          <label class="info-label">个性签名</label>
          <input 
            type="text" 
            v-model="userProfile.signature"
            class="info-input"
            placeholder="写点什么介绍自己..."
            maxlength="50"
          />
        </div>
      </div>
    </div>

    <div class="setting-group">
      <div class="setting-label">
        <span class="label-icon">🔐</span>
        <span class="label-text">账号安全</span>
      </div>
      <div class="security-options">
        <div class="security-item" @click="showPasswordModal = true">
          <span class="security-name">修改密码</span>
          <span class="security-arrow">→</span>
        </div>
        <div class="security-item" @click="showBindModal = true">
          <span class="security-name">绑定邮箱</span>
          <span class="security-status">{{ userProfile.email || '未绑定' }}</span>
          <span class="security-arrow">→</span>
        </div>
        <div class="security-item" @click="showPhoneModal = true">
          <span class="security-name">绑定手机</span>
          <span class="security-status">{{ userProfile.phone || '未绑定' }}</span>
          <span class="security-arrow">→</span>
        </div>
      </div>
    </div>

    <div class="setting-group">
      <div class="setting-label">
        <span class="label-icon">🔔</span>
        <span class="label-text">通知设置</span>
      </div>
      <div class="toggle-options">
        <div class="toggle-item">
          <span class="toggle-name">新消息通知</span>
          <button 
            :class="{ active: notifications.newMessage }"
            class="toggle-btn"
            @click="notifications.newMessage = !notifications.newMessage"
          >
            {{ notifications.newMessage ? '开启' : '关闭' }}
          </button>
        </div>
        <div class="toggle-item">
          <span class="toggle-name">音乐推荐</span>
          <button 
            :class="{ active: notifications.recommend }"
            class="toggle-btn"
            @click="notifications.recommend = !notifications.recommend"
          >
            {{ notifications.recommend ? '开启' : '关闭' }}
          </button>
        </div>
        <div class="toggle-item">
          <span class="toggle-name">活动提醒</span>
          <button 
            :class="{ active: notifications.activity }"
            class="toggle-btn"
            @click="notifications.activity = !notifications.activity"
          >
            {{ notifications.activity ? '开启' : '关闭' }}
          </button>
        </div>
      </div>
    </div>

    <div class="setting-group">
      <div class="setting-label">
        <span class="label-icon">🔒</span>
        <span class="label-text">隐私设置</span>
      </div>
      <div class="toggle-options">
        <div class="toggle-item">
          <span class="toggle-name">公开播放记录</span>
          <button 
            :class="{ active: privacy.showPlayHistory }"
            class="toggle-btn"
            @click="privacy.showPlayHistory = !privacy.showPlayHistory"
          >
            {{ privacy.showPlayHistory ? '公开' : '私密' }}
          </button>
        </div>
        <div class="toggle-item">
          <span class="toggle-name">公开收藏歌单</span>
          <button 
            :class="{ active: privacy.showFavorites }"
            class="toggle-btn"
            @click="privacy.showFavorites = !privacy.showFavorites"
          >
            {{ privacy.showFavorites ? '公开' : '私密' }}
          </button>
        </div>
      </div>
    </div>

    <div class="danger-zone">
      <div class="danger-header">
        <span class="danger-icon">⚠️</span>
        <span class="danger-text">危险操作</span>
      </div>
      <div class="danger-actions">
        <button class="btn-danger" @click="logout">退出登录</button>
        <button class="btn-danger-danger" @click="deleteAccount">注销账号</button>
      </div>
    </div>

    <div class="actions">
      <button class="btn-reset" @click="resetProfile">重置</button>
      <button class="btn-save" @click="saveProfile">保存修改</button>
    </div>

    <!-- 密码修改弹窗 -->
    <div v-if="showPasswordModal" class="mini-modal" @click.self="showPasswordModal = false">
      <div class="mini-modal-content" :class="{ 'dark': isDarkMode }">
        <h4 class="mini-modal-title">修改密码</h4>
        <div class="form-group">
          <label>当前密码</label>
          <input type="password" v-model="passwordForm.current" class="form-input" placeholder="请输入当前密码" />
        </div>
        <div class="form-group">
          <label>新密码</label>
          <input type="password" v-model="passwordForm.new" class="form-input" placeholder="请输入新密码（至少6位）" />
        </div>
        <div class="form-group">
          <label>确认新密码</label>
          <input type="password" v-model="passwordForm.confirm" class="form-input" placeholder="请再次输入新密码" />
        </div>
        <div class="mini-modal-actions">
          <button class="btn-cancel" @click="showPasswordModal = false">取消</button>
          <button class="btn-confirm" @click="changePassword">确认</button>
        </div>
      </div>
    </div>

    <!-- 绑定邮箱弹窗 -->
    <div v-if="showBindModal" class="mini-modal" @click.self="showBindModal = false">
      <div class="mini-modal-content" :class="{ 'dark': isDarkMode }">
        <h4 class="mini-modal-title">绑定邮箱</h4>
        <div class="form-group">
          <label>邮箱地址</label>
          <input type="email" v-model="bindForm.email" class="form-input" placeholder="请输入邮箱地址" />
        </div>
        <div class="form-group">
          <label>验证码</label>
          <div class="code-input-row">
            <input type="text" v-model="bindForm.code" class="form-input" placeholder="请输入验证码" maxlength="6" />
            <button class="btn-get-code" @click="sendCode('email')">获取验证码</button>
          </div>
        </div>
        <div class="mini-modal-actions">
          <button class="btn-cancel" @click="showBindModal = false">取消</button>
          <button class="btn-confirm" @click="bindEmail">确认</button>
        </div>
      </div>
    </div>

    <!-- 绑定手机弹窗 -->
    <div v-if="showPhoneModal" class="mini-modal" @click.self="showPhoneModal = false">
      <div class="mini-modal-content" :class="{ 'dark': isDarkMode }">
        <h4 class="mini-modal-title">绑定手机</h4>
        <div class="form-group">
          <label>手机号码</label>
          <input type="tel" v-model="phoneForm.phone" class="form-input" placeholder="请输入手机号码" maxlength="11" />
        </div>
        <div class="form-group">
          <label>验证码</label>
          <div class="code-input-row">
            <input type="text" v-model="phoneForm.code" class="form-input" placeholder="请输入验证码" maxlength="6" />
            <button class="btn-get-code" @click="sendCode('phone')">获取验证码</button>
          </div>
        </div>
        <div class="mini-modal-actions">
          <button class="btn-cancel" @click="showPhoneModal = false">取消</button>
          <button class="btn-confirm" @click="bindPhone">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMusicStore } from '../stores/musicStore';

const emit = defineEmits(['close']);
const { isDarkMode } = useMusicStore();

const userProfile = ref({
  avatar: '👤',
  nickname: 'OM Music 用户',
  signature: '音乐爱好者',
  email: '',
  phone: ''
});

const notifications = ref({
  newMessage: true,
  recommend: true,
  activity: false
});

const privacy = ref({
  showPlayHistory: true,
  showFavorites: true
});

const showPasswordModal = ref(false);
const showBindModal = ref(false);
const showPhoneModal = ref(false);

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
});

const bindForm = ref({
  email: '',
  code: ''
});

const phoneForm = ref({
  phone: '',
  code: ''
});

// 加载保存的设置
const savedProfile = localStorage.getItem('userProfile');
if (savedProfile) {
  const profile = JSON.parse(savedProfile);
  userProfile.value = { ...userProfile.value, ...profile };
}

const savedNotifications = localStorage.getItem('notifications');
if (savedNotifications) {
  notifications.value = { ...notifications.value, ...JSON.parse(savedNotifications) };
}

const savedPrivacy = localStorage.getItem('privacy');
if (savedPrivacy) {
  privacy.value = { ...privacy.value, ...JSON.parse(savedPrivacy) };
}

function changeAvatar() {
  // 模拟更换头像
  const avatars = ['👤', '😊', '😎', '🤓', '🎭', '🎵', '🎶', '🎸', '🎹', '🎤'];
  const randomIndex = Math.floor(Math.random() * avatars.length);
  userProfile.value.avatar = avatars[randomIndex];
}

function changePassword() {
  if (passwordForm.value.new.length < 6) {
    alert('密码长度至少6位');
    return;
  }
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    alert('两次输入的密码不一致');
    return;
  }
  alert('密码修改成功');
  showPasswordModal.value = false;
  passwordForm.value = { current: '', new: '', confirm: '' };
}

function sendCode(type) {
  if (type === 'email' && !bindForm.value.email) {
    alert('请先输入邮箱地址');
    return;
  }
  if (type === 'phone' && !phoneForm.value.phone) {
    alert('请先输入手机号码');
    return;
  }
  alert('验证码已发送');
}

function bindEmail() {
  if (!bindForm.value.email || !bindForm.value.code) {
    alert('请填写完整信息');
    return;
  }
  userProfile.value.email = bindForm.value.email;
  alert('邮箱绑定成功');
  showBindModal.value = false;
  bindForm.value = { email: '', code: '' };
}

function bindPhone() {
  if (!phoneForm.value.phone || !phoneForm.value.code) {
    alert('请填写完整信息');
    return;
  }
  userProfile.value.phone = phoneForm.value.phone;
  alert('手机绑定成功');
  showPhoneModal.value = false;
  phoneForm.value = { phone: '', code: '' };
}

function resetProfile() {
  userProfile.value = {
    avatar: '👤',
    nickname: 'OM Music 用户',
    signature: '音乐爱好者',
    email: '',
    phone: ''
  };
  notifications.value = {
    newMessage: true,
    recommend: true,
    activity: false
  };
  privacy.value = {
    showPlayHistory: true,
    showFavorites: true
  };
}

function logout() {
  if (confirm('确定要退出登录吗？')) {
    alert('已退出登录');
  }
}

function deleteAccount() {
  if (confirm('注销账号将删除所有数据，此操作不可恢复！确定要注销吗？')) {
    alert('账号已注销');
  }
}

function saveProfile() {
  localStorage.setItem('userProfile', JSON.stringify(userProfile.value));
  localStorage.setItem('notifications', JSON.stringify(notifications.value));
  localStorage.setItem('privacy', JSON.stringify(privacy.value));
  emit('close');
}
</script>

<style scoped>
.account-settings {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.profile-section {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #f5f5f7;
  border-radius: 12px;
}

.dark .profile-section {
  background: #222;
}

.avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
}

.btn-change-avatar {
  padding: 6px 12px;
  border: 1px solid #e8e8e8;
  background: #fff;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dark .btn-change-avatar {
  background: #2a2a2a;
  border-color: #333;
  color: #999;
}

.btn-change-avatar:hover {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.profile-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-label {
  font-size: 12px;
  color: #999;
}

.dark .info-label {
  color: #666;
}

.info-input {
  padding: 10px 12px;
  border: 1px solid #e8e8e8;
  background: #fff;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  outline: none;
  transition: all 0.2s ease;
}

.dark .info-input {
  background: #2a2a2a;
  border-color: #333;
  color: #fff;
}

.info-input:focus {
  border-color: #ff6b6b;
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

.security-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.security-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f5f5f7;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dark .security-item {
  background: #222;
}

.security-item:hover {
  background: #e8e8e8;
}

.dark .security-item:hover {
  background: #2a2a2a;
}

.security-name {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.dark .security-name {
  color: #ccc;
}

.security-status {
  font-size: 12px;
  color: #999;
}

.dark .security-status {
  color: #666;
}

.security-arrow {
  color: #ccc;
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

.danger-zone {
  padding: 15px;
  background: #fff5f5;
  border-radius: 12px;
  border: 1px solid #ffe0e0;
}

.dark .danger-zone {
  background: #2a1a1a;
  border-color: #3a2a2a;
}

.danger-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.danger-icon {
  font-size: 18px;
}

.danger-text {
  font-size: 14px;
  font-weight: 600;
  color: #ff6b6b;
}

.danger-actions {
  display: flex;
  gap: 15px;
}

.btn-danger {
  padding: 10px 20px;
  border: 1px solid #ff6b6b;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  color: #ff6b6b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-danger:hover {
  background: #ff6b6b;
  color: #fff;
}

.btn-danger-danger {
  padding: 10px 20px;
  border: none;
  background: #ff6b6b;
  border-radius: 8px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-danger-danger:hover {
  background: #ff4444;
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

/* Mini Modal */
.mini-modal {
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

.mini-modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  width: 90%;
  max-width: 350px;
}

.mini-modal-content.dark {
  background: #1a1a1a;
}

.mini-modal-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px;
  text-align: center;
}

.dark .mini-modal-title {
  color: #fff;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.form-group label {
  font-size: 12px;
  color: #999;
}

.dark .form-group label {
  color: #666;
}

.form-input {
  padding: 10px 12px;
  border: 1px solid #e8e8e8;
  background: #fff;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  outline: none;
  transition: all 0.2s ease;
}

.dark .form-input {
  background: #2a2a2a;
  border-color: #333;
  color: #fff;
}

.form-input:focus {
  border-color: #ff6b6b;
}

.code-input-row {
  display: flex;
  gap: 10px;
}

.code-input-row .form-input {
  flex: 1;
}

.btn-get-code {
  padding: 10px 15px;
  border: 1px solid #e8e8e8;
  background: #fff;
  border-radius: 8px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.dark .btn-get-code {
  background: #2a2a2a;
  border-color: #333;
  color: #999;
}

.btn-get-code:hover {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.mini-modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-cancel {
  padding: 8px 16px;
  border: 1px solid #e8e8e8;
  background: #fff;
  border-radius: 6px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.dark .btn-cancel {
  background: #2a2a2a;
  border-color: #333;
  color: #999;
}

.btn-confirm {
  padding: 8px 16px;
  border: none;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  border-radius: 6px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
}
</style>