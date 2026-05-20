<script setup>
import BaseButton from "../ui/BaseButton.vue";

defineProps({
      currentUser: {
        type: Object,
        default: null }
})
const emit = defineEmits(['open-login', 'open-register', 'logout'])
</script>

<template>
  <header class="top-bar">
    <div class="user-section">
      <template v-if="currentUser">
        <BaseButton type="gold" @click="emit('logout')">Выйти</BaseButton>
        <span class="user-name">{{ currentUser.fullName }}</span>
      </template>
      <template v-else>
        <BaseButton type="gold" @click="emit('open-login')">Вход</BaseButton>
        <BaseButton type="outline" @click="emit('open-register')">Регистрация</BaseButton>
      </template>
    </div>
  </header>
</template>

<style scoped>
.top-bar {
  display: flex; align-items: center; justify-content: center;
  padding: 24px; background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0 0 24px 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}
.top-bar:hover { box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }

.user-section button { margin-right: 10px; }
.user-name { font-weight: 600; margin-right: 10px; color: #ffd700; }

.btn {
  padding: 8px 18px; border-radius: 25px; border: none;
  cursor: pointer; font-size: 12pt; font-weight: 500;
  transition: all 0.3s ease;
}
.btn-gold { background: #ffd700; color: #1a1a2e; border: 1px solid #ffd700; }
.btn-gold:hover { box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }

.btn-outline { background: transparent; border: 1px solid #ffd700; color: #ffd700; }
.btn-outline:hover {
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  background: #ffd700; color: #1a1a2e;
}

.logout-btn { background: #ffd700; color: #1a1a2e; border: 1px solid #ffd700; }
</style>