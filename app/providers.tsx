 
'use client'  

import type React from "react"
import { Provider } from "react-redux"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { store } from "@/store/store"

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#5b7cf6",
    },
    secondary: {
      main: "#8b5cf6",
    },
    background: {
      default: "#0a0a0a",
      paper: "#18181b",
    },
  },
  typography: {
    fontFamily: "var(--font-sans)",
  },
})

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Provider>
  )
}