import { RequestError } from '@/types/utils'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface AdminStoreState {
  isAuth: boolean
  isLoggingOut: boolean
  error: RequestError | null
  selectedStudentIds: Set<string> | null
}

interface AdminStoreActions {
  setIsAuth: (isAuth: boolean) => void
  setIsLoggingOut: (isLoggingOut: boolean) => void
  setError: (error: RequestError | null) => void
  setSelectedStudentIds: (selectedIds: Set<string> | null) => void
}

type AdminStore = AdminStoreState & AdminStoreActions

const defaultState: AdminStoreState = {
  isAuth: false,
  isLoggingOut: false,
  error: null,
  selectedStudentIds: null
}

export const useAdminStore = create<AdminStore>()(
  persist(set => ({
    ...defaultState,
    setIsAuth: isAuth => set({ isAuth }),
    setIsLoggingOut: isLoggingOut => set({ isLoggingOut }),
    setError: error => set({ error }),
    setSelectedStudentIds: selectedStudentIds => set({ selectedStudentIds })
  }), {
    name: import.meta.env.VITE_PERSISTENT_STORE_NAME,
    storage: createJSONStorage(() => localStorage),
    partialize: state => ({
      isAuth: state.isAuth,
    })
  })
)
