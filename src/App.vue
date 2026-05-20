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

// Импортируем нашу логику избранного
import { useFavorites } from './composable/useFavorites'

const pers = ref([])
const searchQuery = ref('')
const selectedGender = ref([])
const selectedHouse = ref([])
const selectedSort = ref('default')
const selectedOrder = ref('asc')

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

const {
  favorites,
  currentUser,
  stats,
  toggleFavorite,
  login: handleLogin,
  logout: handleLogout
} = useFavorites(pers)

const resetFilters = () => {
  searchQuery.value = ''
  selectedSort.value = 'default'
  selectedOrder.value = 'asc'
  selectedGender.value = []
  selectedHouse.value = []
}

const FunFilters = (items, sortField, direction) => {
  return items.sort((a, b) => {
    if (sortField === 'yearOfBirth') {
      const va = Number(a.yearOfBirth) || 0
      const vb = Number(b.yearOfBirth) || 0
      return direction === 'asc' ? va - vb : vb - va
    }
    if (sortField === 'alive') {
      const va = a.alive ? 1 : 0
      const vb = b.alive ? 1 : 0
      return direction === 'asc' ? vb - va : va - vb
    }
    const va = String(a[sortField] || '').toLowerCase()
    const vb = String(b[sortField] || '').toLowerCase()
    return direction === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
  })
}

const sortedPost = computed(() => {
  let res = [...pers.value]
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    res = res.filter(item =>
        item.name?.toLowerCase().includes(query) ||
        item.species?.toLowerCase().includes(query) ||
        item.actor?.toLowerCase().includes(query)
    )
  }
  if (selectedGender.value.length > 0) {
    res = res.filter(item => selectedGender.value.includes(item.gender))
  }
  if (selectedHouse.value.length > 0) {
    res = res.filter(item => selectedHouse.value.includes(item.house))
  }
  if (selectedSort.value !== 'default') {
    res = FunFilters(res, selectedSort.value, selectedOrder.value)
  }
  return res
})

onMounted(async () => {
  const res = await fetch('https://hp-api.onrender.com/api/characters')
  pers.value = await res.json()
})

const handleLoginSuccess = (user) => {
  handleLogin(user)
}
</script>

<template>
  <div class="block-content">
    <UserNavbar
        :currentUser="currentUser"
        @open-login="showLogin = true"
        @open-register="showRegister = true"
        @logout="handleLogout"
    />

    <h2>Задание 2. Компонентный подход во Vue</h2>

    <div class="controls">
      <div class="filters">
        <FilterPanel
            v-model:selected-gender="selectedGender"
            v-model:selected-house="selectedHouse"
        />
        <div class="search-sort-row">
          <my-input v-model="searchQuery" placeholder="Поиск..." class="sort" />
          <div class="sel">
            <MySelect v-model="selectedSort" :options="sortOptions" />
            <MySelect v-model="selectedOrder" :options="orderOptions" />
          </div>
          <BaseButton style="width: 100%" type="gold" @click="resetFilters">Сбросить фильтры</BaseButton>
        </div>

        <!-- Используем stats из хука -->
        <FavoritesStats
            v-if="currentUser"
            :wizard-count="stats.wizard"
            :non-wizard-count="stats.nonWizard"
        />
      </div>
    </div>

    <div v-if="!pers.length" class="status">Загрузка...</div>
    <div class="passs" v-else>
      <div class="count-row">
        <p class="name">Найдено: {{ sortedPost.length }}</p>
      </div>
      <ListPers
          :pers="sortedPost"
          :favorites="favorites"
          :current-user="currentUser"
          @toggle-fav="toggleFavorite"
      />
    </div>
  </div>

  <AuthModal
      v-model:show-login="showLogin"
      v-model:show-register="showRegister"
      @login-success="handleLoginSuccess"
  />
</template>

<style>
/* Глобальные стили */
html, body {
  margin: 0; padding: 0; min-height: 100vh;
  background: linear-gradient(135deg, #0c0c1d 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%);
  color: #e0e0e0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.filters {
  display: flex; gap: 40px; padding: 15px;
  border: 1px solid #ffd700; border-radius: 8px; justify-content: center; flex-wrap: wrap;
}
</style>

<style scoped>
.block-content { max-width: 1400px; margin: 0 auto; }
h2 { text-align: center; padding: 20px; color: #ffd700; }
.controls {
  padding: 20px; background: rgba(255, 255, 255, 0.04); backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 215, 0, 0.15); border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); margin-bottom: 15px;
}
.search-sort-row { display: flex; flex-direction: column; gap: 15px; margin-top: 20px; align-items: center; }
.sel { display: flex; gap: 15px; width: 100%; max-width: 600px; }
.sort { width: 100%; max-width: 600px; }
.status { text-align: center; padding: 40px; font-size: 18px; }
.passs {
  background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 16px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); margin-bottom: 15px; min-height: 200px;
}
.count-row { display: flex; align-items: center; gap: 15px; padding: 0 24px; }
.name { font-size: 14pt; padding-top: 20px; color: #ffd700; margin: 0; }
</style>