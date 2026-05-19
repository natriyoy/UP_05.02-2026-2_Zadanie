<script setup>



defineProps({
  post: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="character-card">
    <div class="image-container">
      <img
          v-if="post.image"
          :src="post.image"
          :alt="post.name"
      >
      <img
          v-else
          src="/images/6aa77a42bc9f69519b4309243c116f8f.jpg"
          :alt="post.name"
      >
    </div>

    <div class="info">
      <h3 class="character-name">{{ post.name  || "Отсутствует"}}</h3>

      <div class="info-item">
        <span class="info-label">Вид:</span>
        <span class="info-value">{{ post.species  || "Отсутствует"}}</span>
      </div>

      <div class="info-item">
        <span class="info-label">Дата рождения:</span>
        <span class="info-value">{{ post.dateOfBirth || "Отсутствует"}}</span>
      </div>

      <div class="info-item">
        <span class="info-label">Актер:</span>
        <span class="info-value">{{ post.actor  || "Отсутствует"}}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.character-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  margin: 20px;
  height: 100%;
}

.character-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.image-container {
  position: relative;
  overflow: hidden;
  height: 300px;
}

.image-container img {
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.character-card:hover .image-container img {
  transform: scale(1.01);
}

.info {
  padding: 20px;
  background: white;
  height: 100%;
}

.character-name {
  font-size: 10pt;
  font-weight: 700;
  color: #333;
  margin: 0 0 15px 0;
  border-left: 4px solid #667eea;
  padding-left: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;

}



.info-label {
  font-weight: 600;
  color: #667eea;
  font-size: 10pt;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  color: #555;
  font-size: 16px;
  text-align: right;
  margin-left: 15px;
}
</style>