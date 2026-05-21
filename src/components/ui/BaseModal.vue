<script setup>

</script>

<template>

</template>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}

.modal {
  background: #1a1a2e;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 30px;
  width: 90%; max-width: 420px;
  max-height: 90vh; overflow-y: auto;
  display: flex; flex-direction: column; gap: 4px;
}
</style>