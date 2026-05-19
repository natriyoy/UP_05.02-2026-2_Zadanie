<script setup>
import ItemPers from './ItemPers.vue';

defineProps({
  pers: {
    type: Array,
    required: true,

  }
});
</script>

<template>
  <div class="grid-block">
  <div v-for="(per, index) in pers" :key="index">
    <ItemPers
        :post="per"

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