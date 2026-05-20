<template>
  <div v-if="showLogin" class="modal-overlay" @click.self="emit('update:showLogin', false)">
    <div class="modal">
      <h3>Вход</h3>
      <form @submit.prevent="login">
        <input v-model="loginForm.login" placeholder="Логин" required />
        <input v-model="loginForm.password" type="password" placeholder="Пароль" required />
        <p v-if="loginError" class="err">{{ loginError }}</p>
        <button type="submit">Войти</button>
      </form>
    </div>
  </div>

  <div v-if="showRegister" class="modal-overlay" @click.self="emit('update:showRegister', false)">
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

<script setup>
import { ref } from 'vue'

const props = defineProps({
  showLogin: Boolean,
  showRegister: Boolean
})

const emit = defineEmits(['update:showLogin', 'update:showRegister', 'login-success'])

// --- Форма входа ---
const loginForm = ref({ login: '', password: '' })
const loginError = ref('')

const login = () => {
  loginError.value = ''
  const users = JSON.parse(localStorage.getItem('hp_users') || '[]')
  const user = users.find(u => u.login === loginForm.value.login && u.password === loginForm.value.password)

  if (user) {
    const currentUser = {
      login: user.login,
      fullName: `${user.surname} ${user.name} ${user.patronymic}`
    }
    localStorage.setItem('hp_currentUser', JSON.stringify(currentUser))
    emit('login-success', currentUser)
    emit('update:showLogin', false)
    loginForm.value = {
      login: '',
      password: ''
    }
  } else {
    loginError.value = 'Неверный логин или пароль'
  }
}

// --- Форма регистрации ---
const regForm = ref({
  login: '', password: '', surname: '', name: '', patronymic: '',
  phone: '', gender: '', age: '', houses: []
})
const regErrors = ref({})

const register = () => {
  regErrors.value = {}
  const f = regForm.value

  if (!/^[a-zA-Z0-9_]{3,20}$/.test(f.login))
    regErrors.value.login = 'Логин 3-20 символов (буквы, цифры, _)'

  if (f.password.length < 6)
    regErrors.value.password = 'Пароль от 6 символов'

  if (!/^[А-ЯЁ][а-яё]{2,}$/.test(f.surname))
    regErrors.value.surname = 'Фамилия: заглавная + от 2 букв'

  if (!/^[А-ЯЁ][а-яё]+$/.test(f.name))
    regErrors.value.name = 'Имя: заглавная + буквы'

  if (!/^[А-ЯЁ][а-яё]{2,}$/.test(f.patronymic))
    regErrors.value.patronymic = 'Отчество: заглавная + от 2 букв'

  if (!/^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(f.phone))
    regErrors.value.phone = 'Формат: 8(XXX)XXX-XX-XX'

  if (!f.gender)
    regErrors.value.gender = 'Выберите пол'

  if (!f.age || f.age < 10)
    regErrors.value.age = 'Возраст от 10 лет'

  if (!f.houses.length)
    regErrors.value.houses = 'Выберите хотя бы один факультет'

  if (Object.keys(regErrors.value).length) return

  const users = JSON.parse(localStorage.getItem('hp_users') || '[]')
  if (users.find(u => u.login === f.login)) {
    regErrors.value.login = 'Такой логин уже занят'
    return
  }

  users.push({ ...f })
  localStorage.setItem('hp_users', JSON.stringify(users))

  // после регистрации — открываем вход
  emit('update:showRegister', false)
  emit('update:showLogin', true)

  // очищаем форму
  regForm.value = { login: '', password: '', surname: '', name: '', patronymic: '', phone: '', gender: '', age: '', houses: [] }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #1a1a2e;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 30px;
  width: 90%;
  max-width: 420px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

h3 {
  color: #ffd700;
  margin: 0 0 16px 0;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

input[type="text"],
input[type="password"],
input[type="number"] {
  width: 100%;
  box-sizing: border-box;
  background: rgba(255, 255, 126, 0.08);
  color: #fff;
  border: 1px solid rgba(255, 215, 0, 0.4);
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
}

input::placeholder {
  color: rgba(255,255,255,0.4);
}

.radio-group,
.checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 4px 0;
}

.radio-group label,
.checkboxes label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ccc;
  font-size: 13px;
  cursor: pointer;
}

button[type="submit"] {
  margin-top: 12px;
  padding: 10px;
  background: #ffd700;
  color: #1a1a2e;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

button[type="submit"]:hover {
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
}

.err {
  color: #ff5252;
  font-size: 11px;
  min-height: 14px;
  padding-left: 4px;
}
</style>
