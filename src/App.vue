<script setup>
import { ref, onMounted, computed } from 'vue'
import ListPers from './components/ListPers.vue'
import MySelect from './components/MySelect.vue'
import MyInput from './components/MyInput.vue'

// Данные
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

// Авторизация
const currentUser = ref(null)
const showLogin = ref(false)
const showRegister = ref(false)
const favorites = ref([])


const regForm = ref({
  login: '', password: '', surname: '', name: '', patronymic: '',
  phone: '', gender: '', age: '', houses: []
})

const regErrors = ref({})
const loginForm = ref({ login: '', password: '' })
const loginError = ref('')


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

// Фильтрация и сортировка
const sortedPost = computed(() => {
  let list = [...pers.value]

  // Поиск
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p => p.name?.toLowerCase().includes(q) || p.species?.toLowerCase().includes(q) || p.actor?.toLowerCase().includes(q)
    )
  }

  // Фильтры
  if (selectedGender.value.length) {
    list = list.filter(p => selectedGender.value.includes(p.gender))
  }
  if (selectedHouse.value.length) {
    list = list.filter(p => selectedHouse.value.includes(p.house))
  }

  // Сортировка
  if (selectedSort.value !== 'default') {
    list.sort((a, b) => {
      let va = a[selectedSort.value] || ''
      let vb = b[selectedSort.value] || ''

      if (selectedSort.value === 'yearOfBirth') {
        va = Number(va) || 0
        vb = Number(vb) || 0
        return selectedOrder.value === 'asc' ? va - vb : vb - va
      }
      if (selectedSort.value === 'alive') {
        va = a.alive ? 1 : 0
        vb = b.alive ? 1 : 0
        return selectedOrder.value === 'asc' ? vb - va : va - vb
      }

      va = String(va).toLowerCase()
      vb = String(vb).toLowerCase()
      return selectedOrder.value === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
    })
  }
  return list
})

// Избранное
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

// Регистрация
const register = () => {
  regErrors.value = {}
  const f = regForm.value

  if (!/^[a-zA-Z0-9_]{3,20}$/.test(f.login)) {
    regErrors.value.login = 'Логин 3-20 символов'
  }

  if (f.password.length < 6) {
    regErrors.value.password = 'Пароль от 6 символов'
  }

  if (!/^[А-ЯЁ][а-яё]{2,}$/.test(f.surname)) {
    regErrors.value.surname = 'Фамилия: заглавная + от 2 букв'
  }

  if (!/^[А-ЯЁ][а-яё]+$/.test(f.name)) {
    regErrors.value.name = 'Имя: заглавная + буквы'
  }

  if (!/^[А-ЯЁ][а-яё]{2,}$/.test(f.patronymic)) {
    regErrors.value.patronymic = 'Отчество: заглавная + от 2 букв'
  }

  if (!/^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(f.phone)) {
    regErrors.value.phone = 'Телефон: 8(XXX)XXX-XX-XX'
  }

  if (!f.gender) {
    regErrors.value.gender = 'Выберите пол'
  }

  if (!f.age || f.age < 10) {
    regErrors.value.age = 'Возраст от 10 лет'
  }

  if (!f.houses.length) {
    regErrors.value.houses = 'Выберите факультет'
  }

  if (Object.keys(regErrors.value).length) {
    return
  }

  // Сохранение пользователя
  const users = JSON.parse(localStorage.getItem('hp_users') || '[]')
  if (users.find(u => u.login === f.login)) {
    regErrors.value.login = 'Такой логин уже есть'
    return
  }
  users.push({ ...f })
  localStorage.setItem('hp_users', JSON.stringify(users))

  showRegister.value = false
  showLogin.value = true
  // Очистка формы
  Object.keys(regForm.value).forEach(k => {
    regForm.value[k] = Array.isArray(regForm.value[k]) ? [] : ''
  })
}

// Вход
const login = () => {
  loginError.value = ''
  const users = JSON.parse(localStorage.getItem('hp_users') || '[]')
  const user = users.find(u => u.login === loginForm.value.login && u.password === loginForm.value.password)

  if (user) {
    currentUser.value = {
      login: user.login,
      fullName: `${user.surname} ${user.name} ${user.patronymic}`
    }
    localStorage.setItem('hp_currentUser', JSON.stringify(currentUser.value))
    showLogin.value = false
    loginForm.value = { login: '', password: '' }
    loadFavorites()
  } else {
    loginError.value = 'Неверный логин или пароль'
  }
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
</script>

<template>
  <div class="block-content">
    <!-- Верхняя панель -->
    <header class="top-bar">
      <div v-if="currentUser" class="favorites-info">
        Избранное: волшебники - {{ wizardCount.wizard }}; не волшебники - {{ wizardCount.nonWizard }}
      </div>
      <div v-else></div>
      <div class="user-section">
        <template v-if="currentUser">
          <span class="user-name">{{ currentUser.fullName }}</span>
          <button class=" btn logout-btn" @click="logout">Выйти</button>
        </template>
        <template v-else>
          <button class="btn btn-gold" @click="showLogin = true">Вход</button>
          <button class="btn btn-outline" @click="showRegister = true">Регистрация</button>
        </template>
      </div>
    </header>

    <h2>Задание 2. Компонентный подход во Vue</h2>

    <!-- Управление -->
    <div class="controls">

      <div class="filters">
        <div class="filter-block">
          <h4>Пол:</h4>
          <label><input type="checkbox" value="male" v-model="selectedGender"> Мужской</label>
          <label><input type="checkbox" value="female" v-model="selectedGender"> Женский</label>
        </div>

        <div>

        </div>

        <div class="selп">
          <my-input v-model="searchQuery" placeholder="Поиск..." class="sort" />
          <div class="sel">
            <MySelect v-model="selectedSort" :options="sortOptions" />
            <MySelect v-model="selectedOrder" :options="orderOptions" />
          </div>


          <button class="reset-btn" @click="resetFilters">Сбросить</button>
        </div>
        <div class="filter-block">
        <h4>Факультет:</h4>
        <label><input type="checkbox" value="Gryffindor" v-model="selectedHouse"> Гриффиндор</label>
        <label><input type="checkbox" value="Slytherin" v-model="selectedHouse"> Слизерин</label>
        <label><input type="checkbox" value="Ravenclaw" v-model="selectedHouse"> Когтевран</label>
        <label><input type="checkbox" value="Hufflepuff" v-model="selectedHouse"> Пуффендуй</label>
      </div>
      </div>
    </div>

    <!-- Список -->
    <div v-if="!pers.length" class="status">Загрузка...</div>
    <div class="passs" v-else>
      <div class="count-row">
        <p class="name">Найдено: {{ sortedPost.length }}</p>

      </div>
      <ListPers :pers="sortedPost" :favorites="favorites" @toggle-fav="toggleFavorite" />
    </div>
  </div>

  <!-- Модалка входа -->
  <div v-if="showLogin" class="modal-overlay" @click.self="showLogin = false">
    <div class="modal">
      <h3>Вход</h3>
      <form @submit.prevent="login">
        <input v-model="loginForm.login" placeholder="Логин" required />
        <input v-model="loginForm.password" type="password" placeholder="Пароль" required />
        <p class="error">{{ loginError }}</p>
        <button type="submit">Войти</button>
      </form>
    </div>
  </div>

  <!-- Модалка регистрации -->
  <div v-if="showRegister" class="modal-overlay" @click.self="showRegister = false">
    <div class="modal">
      <h3>Регистрация</h3>
      <form @submit.prevent="register">
        <input v-model="regForm.login" placeholder="Логин" />
        <span class="err">{{ regErrors.login }}</span>

        <input v-model="regForm.password" type="password" placeholder="Пароль" />
        <span class="err">{{ regErrors.password }}</span>

        <input v-model="regForm.surname" placeholder="Фамилия" />
        <span class="err">{{ regErrors.surname }}</span>

        <input v-model="regForm.name" placeholder="Имя" />
        <span class="err">{{ regErrors.name }}</span>

        <input v-model="regForm.patronymic" placeholder="Отчество" />
        <span class="err">{{ regErrors.patronymic }}</span>

        <input v-model="regForm.phone" placeholder="8(XXX)XXX-XX-XX" />
        <span class="err">{{ regErrors.phone }}</span>

        <div class="radio-group">
          <label><input type="radio" value="мужской" v-model="regForm.gender"> Мужской</label>
          <label><input type="radio" value="женский" v-model="regForm.gender"> Женский</label>
        </div>
        <span class="err">{{ regErrors.gender }}</span>

        <input v-model.number="regForm.age" type="number" placeholder="Возраст" />
        <span class="err">{{ regErrors.age }}</span>

        <div class="checkboxes">
          <label><input type="checkbox" value="Gryffindor" v-model="regForm.houses"> Гриффиндор</label>
          <label><input type="checkbox" value="Ravenclaw" v-model="regForm.houses"> Когтевран</label>
          <label><input type="checkbox" value="Hufflepuff" v-model="regForm.houses"> Пуффендуй</label>
          <label><input type="checkbox" value="Slytherin" v-model="regForm.houses"> Слизерин</label>
        </div>
        <span class="err">{{ regErrors.houses }}</span>

        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  </div>
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
  margin: 0;
  flex-shrink: 0;
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
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 16px;

  box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.03);

  margin-bottom: 15px;
  transition: all 0.3s ease;
}
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);

  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0 0 24px 24px;

  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);

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
  background:  #ffd700;
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
  background:  #ffd700;
  color: #1a1a2e;
}

.user-section button {
  margin-left: 10px;
  padding: 6px 12px;
  cursor: pointer;
}

.user-name {
  font-weight: 600;
  margin-right: 10px;
}

.favorites-info {
  font-weight: bold;
}

.logout-btn {
  background:  #ffd700;
  color: #1a1a2e;
  border: 1px solid #ffd700;
}


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 400px;
}

.modal input {
  width: 100%;
  padding: 10px;
  margin: 6px 0;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal button[type="submit"] {
  width: 100%;
  padding: 10px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}


.err,
.error {
  color: red;
  font-size: 12px;
  display: block;
  min-height: 16px;
}


.radio-group,
.checkboxes {
  display: flex;
  gap: 15px;
  margin: 8px 0;
  flex-wrap: wrap;
}

.radio-group label,
.checkboxes label {
  cursor: pointer;
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
.controls {

  padding: 20px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 16px;

  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.03);

  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.sel {
  display: flex;
  gap: 15px;

}

.sort {
  margin-bottom: 15px;
}

.filters {
  display: flex;
  gap: 40px;
  padding: 15px;
  border: 1px solid #ffd700;
  border-radius: 8px;

justify-content: center;

  align-items: center;

}

.filter-block h4 {
  margin-bottom: 10px;
}

.filter-block label {

 display: block;
  cursor: pointer;
}


.status {
  text-align: center;
  padding: 40px;
}


.count-row {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 0 24px;
}

.count {
  color: gray;
  margin: 0;
}

.reset-btn {
  background: #ffd700;
  color: #1a1a2e;
  border: 1px solid #ffd700;
  cursor: pointer;
  border-radius: 15px;
  width: 100%;
  font-size: 12pt;
  height: 40px;
  transition: 0.2s;
}

.reset-btn:hover {

    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
    background:  #ffd700;
    color: #1a1a2e;

}
</style>