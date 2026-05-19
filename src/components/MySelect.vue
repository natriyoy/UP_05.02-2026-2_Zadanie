<script setup>
const emit = defineEmits(['update:modelValue']);

defineProps({
  modelValue: {
    type: String,
  },
  options: {
    type: Array,
    default: () => [],
  }
})

const changeOption = (event) => {
  console.log(event.target.value);
  emit('update:modelValue', event.target.value);
}
</script>

<template>
  <select :value="modelValue" @change="changeOption">
    <option disabled value="">Выберите из списка</option>
    <option v-for="option in options" :key="option.value" :value="option.value">{{option.name}}</option>
  </select>
</template>

<style scoped>
select {
  width: 100%;
  background: rgba(255, 255, 126, 0.25);
  color: #ffffff;
  border: 1px solid #ffd700;
  margin-bottom: 15px;
  padding: 10px 15px;
  border-radius: 15px;
  font-size: 12pt;

}
option {
  background: #ffd700;
}

</style>