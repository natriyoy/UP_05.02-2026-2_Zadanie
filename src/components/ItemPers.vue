<script setup>
import { ref } from 'vue';
import MyDialog from './MyDialog.vue';

const props = defineProps({
  post: { type: Object, required: true },
  isFavorite: { type: Boolean, default: false },
  currentUser: { type: Object, required: null }

});

const emit = defineEmits(['toggle-fav']);
const showDialog = ref(false);

const handleFavorite = () => {
  emit('toggle-fav', props.post.name);
};

</script>

<template>
  <div class="character-card" @click="showDialog = true">
    <div class="image-container">
      <img v-if="post.image && post.image !== ''" :src="post.image" :alt="post.name" @error="(e) => e.target.src = '/images/6aa77a42bc9f69519b4309243c116f8f.jpg'">
      <img v-else src="/images/6aa77a42bc9f69519b4309243c116f8f.jpg" :alt="post.name">
    </div>
    <div class="info">
      <h3 class="character-name">{{ post.name || "Отсутствует" }}
      </h3>
      <div class="info-item">
        <span class="info-label">Вид:</span>
        <span class="info-value">{{ post.species || "Отсутствует" }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Дата рождения:</span>
        <span class="info-value">{{ post.dateOfBirth || "Отсутствует" }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Актер:</span>
        <span class="info-value">{{ post.actor || "Отсутствует" }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Дом:</span>
        <span class="info-value">{{ post.house || "Отсутствует" }}</span>
      </div>
      <div class="info-item2 ">
        <span class="info-label">Пол:</span>
        <span class="info-value">{{ post.gender === 'male' ? 'Мужской' : post.gender === 'female' ? 'Женский' : 'Отсутствует' }}</span>
      </div>

      <button v-if="currentUser" class="fav-btn" @click.stop="handleFavorite">
        {{ isFavorite ? 'Удалить из избранного' : 'Добавить в избранное' }}
      </button>
    </div>
  </div>

  <MyDialog v-model:show="showDialog">
    <div class="modal-inner">
      <div class="modal-header">
        <h2 class="modal-name">{{ post.name || "Без имени" }}</h2>
        <button class="close-btn" @click="showDialog = false">✕</button>
      </div>

      <div class="modal-info">
        <div class="modal-row" v-if="post.species">
          <span class="modal-label">Вид</span>
          <span class="modal-value">{{ post.species }}</span>
        </div>

        <div class="modal-row">
          <span class="modal-label">Пол</span>
          <span class="modal-value">{{ post.gender === 'male' ? 'Мужской' : post.gender === 'female' ? 'Женский' : 'Не указан' }}</span>
        </div>

        <div class="modal-row" v-if="post.house">
          <span class="modal-label">Факультет</span>
          <span class="modal-value">{{ post.house }}</span>
        </div>

        <div class="modal-row" v-if="post.dateOfBirth">
          <span class="modal-label">Дата рождения</span>
          <span class="modal-value">{{ post.dateOfBirth }}</span>
        </div>

        <div class="modal-row" v-if="post.yearOfBirth">
          <span class="modal-label">Год рождения</span>
          <span class="modal-value">{{ post.yearOfBirth }}</span>
        </div>

        <div class="modal-row" v-if="post.ancestry">
          <span class="modal-label">Происхождение</span>
          <span class="modal-value">{{ post.ancestry }}</span>
        </div>

        <div class="modal-row" v-if="post.eyeColour">
          <span class="modal-label">Цвет глаз</span>
          <span class="modal-value">{{ post.eyeColour }}</span>
        </div>

        <div class="modal-row" v-if="post.hairColour">
          <span class="modal-label">Цвет волос</span>
          <span class="modal-value">{{ post.hairColour }}</span>
        </div>

        <div class="modal-row" v-if="post.patronus">
          <span class="modal-label">Патронус</span>
          <span class="modal-value">{{ post.patronus }}</span>
        </div>

        <div class="modal-row" v-if="post.actor">
          <span class="modal-label">Актер</span>
          <span class="modal-value">{{ post.actor }}</span>
        </div>

        <div class="modal-row" v-if="post.alternate_actors && post.alternate_actors.length">
          <span class="modal-label">Другие актеры</span>
          <span class="modal-value">{{ post.alternate_actors.join(', ') }}</span>
        </div>

        <div class="modal-row" v-if="post.alternate_names && post.alternate_names.length">
          <span class="modal-label">Другие имена</span>
          <span class="modal-value">{{ post.alternate_names.join(', ') }}</span>
        </div>

        <div class="modal-row">
          <span class="modal-label">Волшебник</span>
          <span class="modal-value">{{ post.wizard ? 'Да' : 'Нет' }}</span>
        </div>

        <div class="modal-row">
          <span class="modal-label">Студент Хогвартса</span>
          <span class="modal-value">{{ post.hogwartsStudent ? 'Да' : 'Нет' }}</span>
        </div>

        <div class="modal-row">
          <span class="modal-label">Сотрудник Хогвартса</span>
          <span class="modal-value">{{ post.hogwartsStaff ? 'Да' : 'Нет' }}</span>
        </div>

        <div class="modal-row">
          <span class="modal-label">Статус</span>
          <span class="modal-value" :class="post.alive ? 'alive' : 'dead'">{{ post.alive ? '✅ Жив' : '💀 Мёртв' }}</span>
        </div>

        <div class="modal-row" v-if="post.wand && (post.wand.wood || post.wand.core || post.wand.length)">
          <span class="modal-label">Палочка</span>
          <span class="modal-value">{{ post.wand.wood }}{{ post.wand.length ? ',' + post.wand.length + 'см' : '' }}</span>
        </div>
      </div>
    </div>
  </MyDialog>
</template>

<style scoped>
.character-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin: 10px;
  height: 100%;
  cursor: pointer;
  position: relative;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.1);
}

.character-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.3);
}

.image-container {
  position: relative;
  overflow: hidden;
  height: 300px;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  transition: transform 0.3s ease;
}

.character-card:hover .image-container img {
  transform: scale(1.05);
}

.info {
  padding:  20px 20px 0 20px;
  display: flex;
  flex-direction: column;
}

.character-name {
  font-size: 16px;
  font-weight: 700;
  color: #ffd700;
  margin: 0 0 15px 0;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.info-item2 {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 8px 0;

}

.info-label {
  font-weight: 600;
  color: #b983ff;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  color: #ccc;
  font-size: 14px;
  text-align: right;
  margin-left: 15px;
}

.fav-btn {
  margin-top: 12px;
  padding: 8px 14px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  width: 100%;
  height: 40px;
  transition: all 0.3s;
  align-self: flex-start;
}

.fav-btn:hover {
  background: rgba(255, 215, 0, 0.2);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
}

.fav-btn:active {
  transform: scale(0.96);
}

.modal-inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-name {
  font-size: 20px;
  font-weight: 700;
  color: #ffd700;
  border-left: 4px solid #ffd700;
  padding-left: 12px;
  margin: 0;
}

.close-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 18px;
  cursor: pointer;
  color: #ccc;
  padding: 6px 10px;
  border-radius: 8px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 100, 100, 0.2);
  border-color: rgba(255, 100, 100, 0.4);
  color: #ff6b6b;
}

.modal-info {
  display: flex;
  flex-direction: column;
}

.modal-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  gap: 12px;
}

.modal-label {
  font-weight: 600;
  color: #b983ff;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.modal-value {
  color: #ccc;
  font-size: 14px;
  text-align: right;
}

.alive {
  color: #4caf50;
  font-weight: 600;
}

.dead {
  color: #ff5252;
  font-weight: 600;
}
</style>