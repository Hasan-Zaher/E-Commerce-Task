import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface FiltersState {
  searchQuery: string
  selectedCategory: string
  priceRange: [number, number]
  minRating: number
}

const initialState: FiltersState = {
  searchQuery: "",
  selectedCategory: "all",
  priceRange: [0, 1000],
  minRating: 0,
}

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload
    },
    setMinRating: (state, action: PayloadAction<number>) => {
      state.minRating = action.payload
    },
    resetFilters: (state) => {
      state.searchQuery = ""
      state.selectedCategory = "all"
      state.priceRange = [0, 1000]
      state.minRating = 0
    },
  },
})

export const { setSearchQuery, setSelectedCategory, setPriceRange, setMinRating, resetFilters } = filtersSlice.actions
export default filtersSlice.reducer
