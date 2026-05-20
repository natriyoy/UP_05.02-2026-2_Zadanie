<script setup>
defineProps({
  show: { type: Boolean, default: false }
})
const emit = defineEmits(['update:show'])

const closeDialog = () => emit('update:show', false)
</script>

<template>
  <div v-if="show" class="dialog" @click="closeDialog">
    <div class="content_dialog" @click.stop>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.dialog {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  z-index: 1000;
}
.content_dialog {
  margin: auto;
  padding: 25px;
  min-width: 300px;
  max-width: 650px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;


  border-radius: 20px;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  background: #1a1a2e;

  border: 1px solid rgba(255, 215, 0, 0.1);
}
</style>