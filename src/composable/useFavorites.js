import { ref, computed, onMounted } from 'vue'

export function useFavorites(persList) {
    const favorites = ref([])
    const currentUser = ref(null)

    const loadFavorites = () => {
        if (!currentUser.value) return
        try {
            const all = JSON.parse(localStorage.getItem('hp_favorites') || '{}')
            favorites.value = all[currentUser.value.login] || []
        } catch {
            favorites.value = []
        }
    }

    const saveFavorites = () => {
        if (!currentUser.value) return
        try {
            const all = JSON.parse(localStorage.getItem('hp_favorites') || '{}')
            all[currentUser.value.login] = favorites.value
            localStorage.setItem('hp_favorites', JSON.stringify(all))
        } catch (e) {
            console.error('Ошибка сохранения избранного:', e)
        }
    }

    const toggleFavorite = (charName) => {
        if (!currentUser.value) return
        const index = favorites.value.indexOf(charName)
        if (index > -1) {
            favorites.value.splice(index, 1)
        } else {
            favorites.value.push(charName)
        }
        saveFavorites()
    }

    const stats = computed(() => {
        const favChars = persList.value.filter(p => favorites.value.includes(p.name))
        return {
            wizard: favChars.filter(p => p.wizard === true).length,
            nonWizard: favChars.filter(p => p.wizard !== true).length
        }
    })

    onMounted(() => {
        const savedUser = localStorage.getItem('hp_currentUser')
        if (savedUser) {
                currentUser.value = JSON.parse(savedUser)
                loadFavorites()

        }
    })

    const login = (user) => {
        currentUser.value = user
        localStorage.setItem('hp_currentUser', JSON.stringify(user))
        loadFavorites()
    }

    const logout = () => {
        currentUser.value = null
        localStorage.removeItem('hp_currentUser')
        favorites.value = []
    }

    return {
        favorites,
        currentUser,
        stats,
        toggleFavorite,
        login,
        logout
    }
}