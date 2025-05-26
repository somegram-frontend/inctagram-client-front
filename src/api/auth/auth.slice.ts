import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  isAuth: boolean
  isLoading: boolean
  isLogoutLoading: boolean
}

const initialState: AuthState = {
  isAuth: false,
  isLoading: true,
  isLogoutLoading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<boolean>) {
      state.isAuth = action.payload
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setIsLogoutLoading(state, action: PayloadAction<boolean>) {
      state.isAuth = action.payload
    },
  },
})

export const authActions = authSlice.actions
export default authSlice.reducer
