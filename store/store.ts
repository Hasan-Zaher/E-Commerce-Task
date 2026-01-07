import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { productsApi } from "./services/productsApi"
import { cartsApi } from "./services/cartsApi"
import cartReducer from "./slices/cartSlice"
import filtersReducer from "./slices/filtersSlice"

export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    [cartsApi.reducerPath]: cartsApi.reducer,
    cart: cartReducer,
    filters: filtersReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(productsApi.middleware, cartsApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
