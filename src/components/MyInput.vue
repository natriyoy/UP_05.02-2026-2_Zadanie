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
  padding: 10px 15px;
  border: 1px solid teal;
  box-sizing: border-box;
}
</style>