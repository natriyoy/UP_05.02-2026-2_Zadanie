<script setup>
import ItemPers from './ItemPers.vue';

defineProps({
  pers: { type: Array, required: true },
  favorites: { type: Array, default: () => [] },
  currentUser: { type: Object, default: null },
});
const emit = defineEmits(['toggle-fav']);
</script>

<template>
  <div class="grid-block">
    <div v-for="(per, index) in pers" :key="index">
      <ItemPers
          :post="per"
          :is-favorite="favorites.includes(per.name)"
          @toggle-fav="(name) => emit('toggle-fav', name)"
      ></ItemPers>
    </div>
  </div>
</template>

<style scoped>
.grid-block {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}
</style>