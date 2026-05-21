<script setup>
import { ref } from 'vue';
import MyDialog from '../../ui/MyDialog.vue';
import BaseButton from "@/components/ui/BaseButton.vue";

const props = defineProps({
  post: { type: Object, required: true },
  isFavorite: { type: Boolean, default: false },
  currentUser: { type: Object, default: null }
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
      <img v-if="post.image && post.image !== ''" :src="post.image" :alt="post.name">
      <img v-else src="./images/error.webp" :alt="post.name">
    </div>
    <div class="info">
      <h3 class="character-name">{{ post.name || "Отсутствует" }}</h3>
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
      <div class="info-item">
        <span class="info-label">Статус</span>
        <span class="modal-value" :class="post.alive ? 'alive' : 'dead'">
              {{ post.alive ? 'Жив' : 'Мёртв' }}
            </span>
      </div>
      <div class="info-item2">
        <span class="info-label">Пол:</span>
        <span class="info-value">
          {{ post.gender === 'male' ? 'Мужской' : post.gender === 'female' ? 'Женский' : 'Отсутствует' }}
        </span>
      </div>
      <BaseButton type="gold" v-if="currentUser" style="width: 100%; margin-top: 10px" @click.stop="handleFavorite">{{ isFavorite ? 'Удалить из избранного' : 'Добавить в избранное' }}</BaseButton>
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
            <span class="modal-value">
              {{ post.gender === 'male' ? 'Мужской' : post.gender === 'female' ? 'Женский' : 'Не указан' }}
            </span>
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
          <div class="modal-row" v-if="post.alternate_actors && post.alternate_actors.length > 0">
            <span class="modal-label">Другие актеры</span>
            <span class="modal-value">{{ post.alternate_actors.join(', ') }}</span>
          </div>
          <div class="modal-row" v-if="post.alternate_names && post.alternate_names.length > 0">
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
            <span class="modal-value" :class="post.alive ? 'alive' : 'dead'">
              {{ post.alive ? 'Жив' : 'Мёртв' }}
            </span>
          </div>
          <div class="modal-row" v-if="post.wand && (post.wand.wood || post.wand.core || post.wand.length)">
            <span class="modal-label">Палочка</span>
            <span class="modal-value">
              {{ post.wand.wood }} {{ post.wand.length ? post.wand.length : '' }} {{ post.wand.core }}
            </span>
          </div>
        </div>
      </div>
    </MyDialog>

</template>

<style scoped>
.fav-btn {
  margin-top: 12px;
  padding: 8px 14px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700; border-radius: 8px; cursor: pointer;
  font-size: 13px; width: 100%; height: 40px;
  transition: all 0.3s; align-self: flex-start;
}
.fav-btn:hover { background: rgba(255, 215, 0, 0.2); box-shadow: 0 0 15px rgba(255, 215, 0, 0.2); }
.fav-btn:active { transform: scale(0.96); }

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
  transform: scale(1.01);
}
.info {
  padding: 20px;

  height: 100%;
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
  border-bottom: 1px solid #f0f0f0;
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

/* Модалка */
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


  margin: 0;
}
.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s;
}
.close-btn:hover {
  background: #f0f0f0;
  color: white;
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
  border-bottom: 1px solid #f0f0f0;
  gap: 12px;
}
.modal-label {
  font-weight: 600;
  color: #667eea;
  font-size: 10pt;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}
.modal-value {
  color: white;
  font-size: 15px;
  text-align: right;
}
.alive { color: #2e7d32; font-weight: 600; }
.dead  { color: #b22222; font-weight: 600; }
</style>