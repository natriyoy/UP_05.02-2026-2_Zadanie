<script setup>
import { ref, onMounted, computed } from 'vue'
import ListPers from './components/features/characters/ListPers.vue'
import MySelect from './components/ui/MySelect.vue'
import MyInput from './components/ui/MyInput.vue'
import AuthModal from './components/features/auth/AuthModal.vue'
import UserNavbar from './components/layout/UserNavbar.vue'
import FilterPanel from './components/layout/FilterPanel.vue'
import FavoritesStats from './components/features/favorites/FavoritesStats.vue'
import BaseButton from './components/ui/BaseButton.vue'

import { useFavorites } from './composable/useFavorites'
import { useFilters } from './composable/useFilters'

const pers = ref([])

const {
  searchQuery,
  selectedGender,
  selectedHouse,
  selectedSort,
  selectedOrder,
  filteredData: sortedPost,
  totalCount,
  filteredCount,
  hasFilters,
  resetFilters,
  toggleOrder
} = useFilters(pers)

const {
  favorites,
  currentUser,
  stats,
  toggleFavorite,
  login: handleLogin,
  logout: handleLogout
} = useFavorites(pers)

const sortOptions = ref([
  { value: 'default', name: 'По умолчанию' },
  { value: 'name', name: 'По имени' },
  { value: 'yearOfBirth', name: 'По году рождения' },
  { value: 'alive', name: 'По статусу' }
])

const orderOptions = ref([
  { value: 'asc', name: 'По возрастанию' },
  { value: 'desc', name: 'По убыванию' }
])

const showLogin = ref(false)
const showRegister = ref(false)

onMounted(async () => {
  try {
    const res = await fetch('https://hp-api.onrender.com/api/characters')
    pers.value = await res.json()
  } catch (error) {
    console.error('Ошибка загрузки персонажей:', error)
  }
})


const handleLoginSuccess = (user) => {
  handleLogin(user)
}

const handleResetFilters = () => {
  resetFilters()
}
</script>

<template>
  <div class="block-content">
    <UserNavbar :currentUser="currentUser" @open-login="showLogin = true" @open-register="showRegister = true" @logout="handleLogout"/>
    <h2>Задание 2. Компонентный подход во Vue</h2>
    <div class="controls">
      <div class="filters">
        <FilterPanel v-model:selected-gender="selectedGender" v-model:selected-house="selectedHouse"/>
        <div class="search-sort-row">
          <my-input v-model="searchQuery" placeholder="Поиск..." class="sort"/>
          <div class="sel">
            <MySelect v-model="selectedSort" :options="sortOptions"/>
            <MySelect v-model="selectedOrder" :options="orderOptions"/>
          </div>
          <BaseButton style="width: 100%" type="gold" @click="handleResetFilters">Сбросить фильтры</BaseButton>
        </div>
        <FavoritesStats v-if="currentUser" :wizard-count="stats.wizard" :non-wizard-count="stats.nonWizard"/>
      </div>
    </div>

    <div v-if="!pers.length" class="status">Загрузка...</div>
    <div class="passs" v-else>
      <div class="count-row">
        <p class="name">Найдено: {{ sortedPost.length }}</p>
      </div>
      <div class="eroo-mes" v-if="sortedPost.length < 1">Персонажи по заданным параметрам не найдены,<br> измените параметры поиска</div>
      <ListPers :pers="sortedPost" :favorites="favorites" :current-user="currentUser" @toggle-fav="toggleFavorite"/>
    </div>
  </div>
  <AuthModal v-model:show-login="showLogin" v-model:show-register="showRegister" @login-success="handleLoginSuccess"/>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #0c0c1d 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%);
  color: #e0e0e0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.filters {
  display: flex;
  gap: 40px;
  padding: 15px;
  border: 1px solid #ffd700;
  border-radius: 8px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>

<style scoped>
.block-content {
  max-width: 1400px;
  margin: 0 auto;
}
.eroo-mes {
  text-align: center;
  font-size: 20pt;
  color: #ffd700;
}
h2 {
  text-align: center;
  padding: 20px;
  color: #ffd700;
}

.controls {
  padding: 20px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  margin-bottom: 15px;
}

.search-sort-row {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
  align-items: center;
}

.sel {
  display: flex;
  gap: 15px;
  width: 100%;
  max-width: 600px;
}

.sort {
  width: 100%;
  max-width: 600px;
}

.status {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.passs {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  margin-bottom: 15px;
  min-height: 200px;
}

.count-row {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 0 24px;
}

.name {
  font-size: 14pt;
  padding-top: 20px;
  color: #ffd700;
  margin: 0;
}
</style>