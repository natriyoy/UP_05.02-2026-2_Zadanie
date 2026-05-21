<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'default',
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const buttonClass = computed(() => ({
  'btn': true,
  'btn-gold': props.type === 'gold',
  'btn-outline': props.type === 'outline',
}))
</script>

<template>
  <button :class="buttonClass" :disabled="disabled" v-bind="$attrs">
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

/* Золотая кнопка */
.btn-gold {
  background: #ffd700;
  color: #1a1a2e;
  border: 1px solid #ffd700;
}
.btn-gold:hover:not(:disabled) {
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  transform: translateY(-1px);
}

/* Прозрачная с обводкой*/
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
</style>