<script setup>
const emit = defineEmits(["update:show"]);
defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
const hideDialog = () => {
  emit("update:show", false);
}
</script>

<template>
  <div class="dialog" v-if="show" @click.self="hideDialog">
    <div class="content_dialog" @click.stop>
      <slot></slot>
    </div>
  </div>
</template>

<style>
.dialog {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  display: flex;
  z-index: 999;
}
.content_dialog {
  margin: auto;
  background: #1a1a2e;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 25px;
  min-width: 300px;
  max-width: 600px;
  width: 90%;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow-y: auto;
}
</style>
