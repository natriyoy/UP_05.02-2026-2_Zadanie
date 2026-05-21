<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' } // Новый проп для типа input
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input :type="type" :value="modelValue" @input="emit('update:modelValue', $event.target.value)" :placeholder="placeholder"/>
</template>

<style scoped>
input {
  width: 100%;
  background: rgba(255, 255, 126, 0.25);
  color: #ffffff;
  border: 1px solid #ffd700;

  padding: 10px 15px;
  border-radius: 15px;
  font-size: 12pt;
  transition: 0.2s;
}
input:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
}
input::placeholder {
  color: rgb(255, 255, 255);
}
</style>