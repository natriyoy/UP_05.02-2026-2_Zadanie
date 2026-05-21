<script setup>
defineProps({
  selectedGender: { type: Array, default: () => [] },
  selectedHouse: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:selectedGender', 'update:selectedHouse'])

const toggleArrayValue = (arr, value) => {
  const newArr = [...arr]
  const index = newArr.indexOf(value)
  if (index > -1) newArr.splice(index, 1)
  else newArr.push(value)
  return newArr
}
</script>

<template>

    <div class="filter-block">
      <h4 class="cold">Пол:</h4>
      <label>
        <input type="checkbox" :checked="selectedGender.includes('male')" @change="emit('update:selectedGender', toggleArrayValue(selectedGender, 'male'))">
        Мужской
      </label>
      <label>
        <input type="checkbox" :checked="selectedGender.includes('female')" @change="emit('update:selectedGender', toggleArrayValue(selectedGender, 'female'))">
        Женский
      </label>
    </div>

    <div class="filter-block">
      <h4 class="cold">Факультет:</h4>
      <label v-for="house in ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff']" :key="house">
        <input type="checkbox" :value="house" :checked="selectedHouse.includes(house)" @change="emit('update:selectedHouse', toggleArrayValue(selectedHouse, house))">
        {{ { Gryffindor: 'Гриффиндор', Slytherin: 'Слизерин', Ravenclaw: 'Когтевран', Hufflepuff: 'Пуффендуй' }[house] }}
      </label>
    </div>

</template>
<style scoped>

.filter-block h4 {
  margin-bottom: 10px;
  color: #ffd700;
  font-size: 14pt;
}
.filter-block label {
  display: block;
  cursor: pointer;
  margin: 5px 0;
  color: #e0e0e0;
}
.filter-block input[type="checkbox"] {
  appearance: none;
  width: 20px; height: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer; transition: 0.3s;
  position: relative; vertical-align: middle; margin-right: 8px;
}
.filter-block input[type="checkbox"]:hover {
  border-color: #ffd700;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
}
.filter-block input[type="checkbox"]:checked {
  background: rgba(255, 215, 0, 0.2);
  border-color: #ffd700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}
.filter-block input[type="checkbox"]:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffd700;
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
}
</style>