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
  <div class="dialog" v-if="show" @click="hideDialog">
    <div class="content_dialog" @click.stop>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.dialog {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  display: flex;
}
.content_dialog {
  margin: auto;
  background: white;
  border-radius: 12px;
  padding: 25px;
  min-width: 300px;
  max-width: 500px;
  width: 90%;
  display: flex;
  flex-direction: column;
}
</style>