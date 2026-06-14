<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-container" :class="{ 'dark': isDarkMode }">
      <div class="modal-header">
        <h3 class="modal-title">{{ title }}</h3>
        <button class="btn-close" @click="close">✕</button>
      </div>
      <div class="modal-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMusicStore } from '../stores/musicStore';

const props = defineProps({
  title: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close']);

const { isDarkMode } = useMusicStore();

function close() {
  emit('close');
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-container {
  background: #fff;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

.modal-container.dark {
  background: #1a1a1a;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #e8e8e8;
}

.dark .modal-header {
  border-bottom-color: #2a2a2a;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.dark .modal-title {
  color: #fff;
}

.btn-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f7;
  border-radius: 50%;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.dark .btn-close {
  background: #2a2a2a;
  color: #999;
}

.btn-close:hover {
  background: #ff6b6b;
  color: #fff;
}

.modal-content {
  padding: 20px;
  overflow-y: auto;
  max-height: calc(80vh - 70px);
}

.modal-content::-webkit-scrollbar {
  width: 4px;
}

.modal-content::-webkit-scrollbar-track {
  background: transparent;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 2px;
}

.dark .modal-content::-webkit-scrollbar-thumb {
  background: #333;
}
</style>