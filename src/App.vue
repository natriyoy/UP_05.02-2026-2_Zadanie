<script setup>
import { ref, onMounted, computed } from 'vue'
import ListPers from './components/ListPers.vue'
import MySelect from './components/MySelect.vue'
import MyInput from './components/MyInput.vue'
import AuthModal from './components/AuthModal.vue'

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

const currentUser = ref(null)
const showLogin = ref(false)
const showRegister = ref(false)
const favorites = ref([])

onMounted(async () => {
  const res = await fetch('https://hp-api.onrender.com/api/characters')
  pers.value = await res.json()

  const saved = localStorage.getItem('hp_currentUser')
  if (saved) {
    currentUser.value = JSON.parse(saved)
    loadFavorites()
  }
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedSort.value = 'default'
  selectedOrder.value = 'asc'
  selectedGender.value = []
  selectedHouse.value = []
}

const sortedPost = computed(() => {
  let list = [...pers.value]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.species?.toLowerCase().includes(q) ||
        p.actor?.toLowerCase().includes(q)
    )
  }

  if (selectedGender.value.length)
    list = list.filter(p => selectedGender.value.includes(p.gender))

  if (selectedHouse.value.length)
    list = list.filter(p => selectedHouse.value.includes(p.house))

  if (selectedSort.value !== 'default') {
    list.sort((a, b) => {
      if (selectedSort.value === 'yearOfBirth') {
        const va = Number(a.yearOfBirth) || 0
        const vb = Number(b.yearOfBirth) || 0
        return selectedOrder.value === 'asc' ? va - vb : vb - va
      }
      if (selectedSort.value === 'alive') {
        const va = a.alive ? 1 : 0
        const vb = b.alive ? 1 : 0
        return selectedOrder.value === 'asc' ? vb - va : va - vb
      }
      const va = String(a[selectedSort.value] || '').toLowerCase()
      const vb = String(b[selectedSort.value] || '').toLowerCase()
      return selectedOrder.value === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
    })
  }

  return list
})

const loadFavorites = () => {
  if (!currentUser.value) return
  const all = JSON.parse(localStorage.getItem('hp_favorites') || '{}')
  favorites.value = all[currentUser.value.login] || []
}

const saveFavorites = () => {
  if (!currentUser.value) return
  const all = JSON.parse(localStorage.getItem('hp_favorites') || '{}')
  all[currentUser.value.login] = favorites.value
  localStorage.setItem('hp_favorites', JSON.stringify(all))
}

const handleLoginSuccess = (user) => {
  currentUser.value = user
  loadFavorites()
}

const logout = () => {
  currentUser.value = null
  localStorage.removeItem('hp_currentUser')
  favorites.value = []
}

const toggleFavorite = (name) => {
  if (!currentUser.value) return
  const i = favorites.value.indexOf(name)
  if (i > -1) favorites.value.splice(i, 1)
  else favorites.value.push(name)
  saveFavorites()
}

const wizardCount = computed(() => {
  const favs = pers.value.filter(p => favorites.value.includes(p.name))
  return {
    wizard: favs.filter(p => p.wizard).length,
    nonWizard: favs.filter(p => !p.wizard).length
  }
})
console.log(currentUser.value)
</script>

<template>
  <div class="block-content">
    <header class="top-bar">
      <div class="user-section">
        <div v-if="currentUser">
          <button class="btn logout-btn" @click="logout">Выйти</button>
          <span class="user-name">{{ currentUser.fullName }}</span>
        </div>
        <div v-else>
          <button class="btn btn-gold" @click="showLogin = true">Вход</button>
          <button class="btn btn-outline" @click="showRegister = true">Регистрация</button>
        </div>
      </div>
    </header>

    <h2>Задание 2. Компонентный подход во Vue</h2>

    <div class="controls">
      <div class="filters">
        <div class="filter-block">
          <h4 class="cold">Пол:</h4>
          <label><input type="checkbox" value="male" v-model="selectedGender"> Мужской</label>
          <label><input type="checkbox" value="female" v-model="selectedGender"> Женский</label>
        </div>
        <div class="filter-block">
          <h4 class="cold">Факультет:</h4>
          <label>
            <input type="checkbox" value="Gryffindor" v-model="selectedHouse"> Гриффиндор</label>
          <label>
            <input type="checkbox" value="Slytherin" v-model="selectedHouse"> Слизерин</label>
          <label>
            <input type="checkbox" value="Ravenclaw" v-model="selectedHouse"> Когтевран</label>
          <label>
            <input type="checkbox" value="Hufflepuff" v-model="selectedHouse"> Пуффендуй</label>
        </div>
        <div >
          <my-input v-model="searchQuery" placeholder="Поиск..." class="sort" />
          <div class="sel">
            <MySelect v-model="selectedSort" :options="sortOptions" />
            <MySelect v-model="selectedOrder" :options="orderOptions" />
          </div>
          <button class="reset-btn" @click="resetFilters">Сбросить</button>
        </div>
        <div v-if="currentUser" class="favorites-info">
          <div><div class="cold">Избранное:</div>
            волшебники - {{ wizardCount.wizard }} </div>
          <div>не волшебники - {{ wizardCount.nonWizard }}</div>
        </div>

      </div>
    </div>

    <div v-if="!pers.length" class="status">Загрузка...</div>
    <div class="passs" v-else>
      <div class="count-row">
        <p class="name">Найдено: {{ sortedPost.length }}</p>
      </div>
      <ListPers :pers="sortedPost" :favorites="favorites" :currentUser="currentUser" @toggle-fav="toggleFavorite" />
    </div>
  </div>

  <AuthModal
      v-model:showLogin="showLogin"
      v-model:showRegister="showRegister"
      @login-success="handleLoginSuccess"
  />
</template>

<style>
.filter-block input,
.checkboxes input {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: 0.3s;
  position: relative;
}
.filter-block input:hover,
.checkboxes input:hover {
  border-color: #ffd700;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
}
.filter-block input:checked,
.checkboxes input:checked {
  background: rgba(255, 215, 0, 0.2);
  border-color: #ffd700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}
.filter-block input:checked::after,
.checkboxes input:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffd700;
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
}
html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #0c0c1d 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%);
  color: #e0e0e0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>

<style scoped>
.passs {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  margin-bottom: 15px;
}
.top-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0 0 24px 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.top-bar:hover {
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.btn {
  padding: 8px 18px;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  font-size: 12pt;
  font-weight: 500;
  transition: all 0.3s ease;
}
.btn-gold {
  background: #ffd700;
  color: #1a1a2e;
  border: 1px solid #ffd700;
}

.btn-gold:hover {
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.btn-outline {
  background: transparent;
  border: 1px solid #ffd700;
  color: #ffd700;
}

.btn-outline:hover {
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  background: #ffd700;
  color: #1a1a2e;
}

.user-section button {
  margin-right: 10px;
}

.user-name {
  font-weight: 600;
  margin-right: 10px;
}

.favorites-info {
  font-weight: bold;
}

.logout-btn {
  background: #ffd700;
  color: #1a1a2e;
  border: 1px solid #ffd700;
}

h2 {
  text-align: center;
  padding: 20px;
}

.name {
  font-size: 14pt;
  padding-top: 20px;
  color: #ffd700;
}
.cold {
  color: #ffd700;
  font-size: 14pt;
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
.sel { display: flex; gap: 15px; }
.filters {
  display: flex;
  gap: 40px;
  padding: 15px;
  border: 1px solid #ffd700;
  border-radius: 8px;
  justify-content: center;

}
.filter-block h4 { margin-bottom: 10px; }
.filter-block label { display: block; cursor: pointer; }
.status { text-align: center; padding: 40px; }
.count-row { display: flex; align-items: center; gap: 15px; padding: 0 24px; }
.reset-btn {
  background: #ffd700; color: #1a1a2e; border: 1px solid #ffd700;
  cursor: pointer; border-radius: 15px; width: 100%;
  font-size: 12pt; height: 40px; transition: 0.2s;
}
.reset-btn:hover { box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
</style>
