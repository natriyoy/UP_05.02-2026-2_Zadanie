<script setup>
import {computed} from "vue";

defineProps({
  wizardCount: { type: Number, default: 0 },
  nonWizardCount: { type: Number, default: 0 }
})

</script>

<template>
  <div class="favorites-info">
    <div>
      <div class="cold">Избранное:</div>
      волшебники - {{ wizardCount }}
    </div>
    <div>не волшебники - {{ nonWizardCount }}</div>
  </div>
</template>

<style scoped>
.favorites-info {
  font-weight: bold;
  color: #e0e0e0;
  min-width: 200px;
}
.cold { color: #ffd700; font-size: 14pt; margin-bottom: 4px; }
</style>