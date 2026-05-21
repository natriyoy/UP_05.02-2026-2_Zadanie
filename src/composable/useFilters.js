import { ref, computed } from 'vue'

const FunFilters = (items, sortField, direction) => {
    return [...items].sort((a, b) => {
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

export function useFilters(pers) {
    const searchQuery = ref('')
    const selectedGender = ref([])
    const selectedHouse = ref([])
    const selectedSort = ref('default')
    const selectedOrder = ref('asc')

    const filteredData = computed(() => {
        let res = [...pers.value]

        // Фильтр по поисковому запросу
        if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase()
            res = res.filter(item =>
                item.name?.toLowerCase().includes(query) ||
                item.species?.toLowerCase().includes(query) ||
                item.actor?.toLowerCase().includes(query)
            )
        }

        // Фильтр по полу
        if (selectedGender.value.length > 0) {
            res = res.filter(item => selectedGender.value.includes(item.gender))
        }

        // Фильтр по дому
        if (selectedHouse.value.length > 0) {
            res = res.filter(item => selectedHouse.value.includes(item.house))
        }

        // Сортировка
        if (selectedSort.value !== 'default') {
            res = FunFilters(res, selectedSort.value, selectedOrder.value)
        }

        return res
    })

    const totalCount = computed(() => pers.value.length)
    const filteredCount = computed(() => filteredData.value.length)
    const hasFilters = computed(() => {
        return searchQuery.value !== '' ||
            selectedGender.value.length > 0 ||
            selectedHouse.value.length > 0 ||
            selectedSort.value !== 'default'
    })

    const resetFilters = () => {
        searchQuery.value = ''
        selectedGender.value = []
        selectedHouse.value = []
        selectedSort.value = 'default'
        selectedOrder.value = 'asc'
    }

    const toggleOrder = () => {
        selectedOrder.value = selectedOrder.value === 'asc' ? 'desc' : 'asc'
    }

    return {
        searchQuery,
        selectedGender,
        selectedHouse,
        selectedSort,
        selectedOrder,

        filteredData,
        totalCount,
        filteredCount,
        hasFilters,

        resetFilters,
        toggleOrder
    }
}