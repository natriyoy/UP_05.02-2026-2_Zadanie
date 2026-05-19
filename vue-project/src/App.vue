<script setup>

import ListPers from './components/ListPers.vue';

import {ref, onMounted, computed} from 'vue';
import MySelect from "@/components/MySelect.vue";
import MyInput from './components/MyInput.vue';

const pers = ref([]);

const searchQuery = ref("");

const selectedSort = ref("");
const selectedOrder = ref("asc");
const sortBy = ref("");
const sortOpions = ref([
  {value: 'name', name: 'По имени'},
  {value: 'email', name: 'По почте'},
  {value: 'body', name: 'По описанию'}
]);
const orderOptions = ref([
  { value: 'asc', name: 'По возрастанию' },
  { value: 'desc', name: 'По убыванию' }
]);

onMounted(async () => {
  const response = await fetch('tsconfig.json');
  pers.value = await response.json();
  console.log(pers.value);
});

const sortedPost = computed(() => {
  let result = [...pers.value];

  // Фильтрация по имени
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter(post => {
      return (post.name && post.name.toLowerCase().includes(query)) ||
          (post.species && post.species.toLowerCase().includes(query)) ||
          (post.actor && post.actor.toLowerCase().includes(query));
    });
  }

  // Сортировка
  if (selectedSort.value) {
    result.sort((a, b) => {
      const aVal = a[selectedSort.value];
      const bVal = b[selectedSort.value];

      if (selectedOrder.value === 'asc') {
        return aVal.localeCompare(bVal);
      } else {
        return bVal.localeCompare(aVal);
      }
    });
  }

  return result;
});
</script>

<template>
  <div class="block-content">
    <h2 style="margin-bottom: 15px">Задание 2. Компонентный подход во Vue</h2>

    <div>
    <div class="sel">
      <my-select v-model="selectedSort" :options="sortOpions"></my-select>
      <my-select v-model="selectedOrder" :options="orderOptions"></my-select>
    </div>
    <my-input class="sort"
              v-model="searchQuery"

    ></my-input>
  </div>


  <div>
    <ListPers :pers="sortedPost"/>
  </div>
  </div>



</template>

<style scoped>
.block-content {
  flex-direction: column;
  max-width: 1400px;
}
h2 {
  text-align: center;
  padding: 0 20px 0px 20px;
  font-weight: bold;

}
</style>
