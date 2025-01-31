import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {getInitialLanguage, Language} from "@/appRoot/app/lib";


type InitialState = {
  language: Language
}

const initialState: InitialState = {
  language: getInitialLanguage()
}

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload
      localStorage.setItem('language', action.payload)
    }
  }
})

export const {setLanguage} = slice.actions;
export const appReducer = slice.reducer