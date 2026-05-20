<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'default', // 'default', 'gold', 'outline', 'danger'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

// Динамический класс в зависимости от типа кнопки
const buttonClass = computed(() => ({
  'btn': true,
  'btn-gold': props.type === 'gold',
  'btn-outline': props.type === 'outline',
  'btn-danger': props.type === 'danger',
  'btn-default': props.type === 'default'
}))
</script>

<template>
  <button
      :class="buttonClass"
      :disabled="disabled"
      v-bind="$attrs"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
.btn {

  padding: 8px 18px;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  font-size: 12pt;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Золотая кнопка (основная) */
.btn-gold {
  background: #ffd700;
  color: #1a1a2e;
  border: 1px solid #ffd700;
}
.btn-gold:hover:not(:disabled) {
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  transform: translateY(-1px);
}

/* Прозрачная с обводкой (второстепенная) */
.btn-outline {
  background: transparent;
  border: 1px solid #ffd700;
  color: #ffd700;
}
.btn-outline:hover:not(:disabled) {
  background: #ffd700;
  color: #1a1a2e;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

/* Красная кнопка (удалить/выйти) */
.btn-danger {
  background: #ff5252;
  color: white;
  border: 1px solid #ff5252;
}
.btn-danger:hover:not(:disabled) {
  background: #ff1744;
  box-shadow: 0 0 15px rgba(255, 82, 82, 0.4);
}

/* Обычная серая кнопка */
.btn-default {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ccc;
}
.btn-default:hover:not(:disabled) {
  background: #e0e0e0;
}
</style>