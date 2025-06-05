import { AppState } from '@/store'

export const fetchIsAuth = (state: AppState) => state.auth.isAuth
export const fetchIsLoading = (state: AppState) => state.auth.isLoading
export const fetchIsLogoutLoading = (state: AppState) => state.auth.isLogoutLoading
