import { create } from 'zustand'
import { persist, createJSONStorage, devtools, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { User } from '../types/user'

interface AuthState {
    user: User | null
    token: string | null
    loading: boolean
    error: string | null
}

interface AuthActions {
    setUser: (user: User | null) => void
    setToken: (token: string | null) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    setAuth: (user: User, token: string) => void
    logout: () => void
    reset: () => void
    isAuthenticated: () => boolean
    isAdmin: () => boolean
}

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
}

export const useAuthStore = create<AuthState & AuthActions>()(
    devtools(
        persist(
            subscribeWithSelector(
                immer((set, get) => ({
                    ...initialState,

                    setUser: (user) =>
                        set((state) => {
                            state.user = user
                        }),

                    setToken: (token) =>
                        set((state) => {
                            state.token = token
                        }),

                    setLoading: (loading) =>
                        set((state) => {
                            state.loading = loading
                        }),

                    setError: (error) =>
                        set((state) => {
                            state.error = error
                        }),

                    setAuth: (user, token) =>
                        set((state) => {
                            state.user = user
                            state.token = token
                            state.error = null
                        }),

                    logout: () => {
                        set(initialState)
                    },

                    reset: () => set(initialState),

                    isAuthenticated: () => {
                        const { token } = get()
                        return !!token
                    },

                    isAdmin: () => {
                        const { user } = get()
                        return user?.role === 1
                    },
                }))
            ),
            {
                name: 'auth-storage',
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({
                    user: state.user,
                    token: state.token,
                }),
            }
        ),
        {
            name: 'AuthStore',
        }
    )
)

export default useAuthStore
