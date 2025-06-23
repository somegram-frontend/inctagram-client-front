import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SelectedUser {
  id: string
  userName: string
  avatarUrl?: string
}

interface State {
  selectedUser: SelectedUser
  selectedChatId: string
}

const initialState: State = {
  selectedUser: {
    id: '',
    userName: '',
  },
  selectedChatId: '',
}

export const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<SelectedUser>) => {
      state.selectedUser = action.payload
    },
    clearSelectedUser: state => {
      state.selectedUser = initialState.selectedUser
    },
    setSelectedChatId: (state, action: PayloadAction<string>) => {
      state.selectedChatId = action.payload
    },
  },
})

export const chatsActions = chatsSlice.actions
export default chatsSlice.reducer
