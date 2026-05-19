<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Поиск...'
  }
})
const emit = defineEmits(['update:modelValue'])

const updateInput = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <input
      :value="modelValue"
      @input="updateInput"
      :placeholder="placeholder"
      type="text"
  />
</template>

<style scoped>
input {
  width: 100%;
  background: rgba(255, 255, 126, 0.25);
  color: #ffffff;
  border: 1px solid #ffd700;
  margin-bottom: 15px;
  padding: 10px 15px;
  border-radius: 15px;
  font-size: 12pt;
}
input::placeholder {
  color: #ffffff;
}
</style>