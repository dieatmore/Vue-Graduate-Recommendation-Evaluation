import type { Category } from '@/types'
import { shallowRef } from 'vue'

const categorysS = shallowRef<Category[]>()
const clear = () => (categorysS.value = undefined)
const store = { categorysS, clear }

export const useCategoryStore = () => store
