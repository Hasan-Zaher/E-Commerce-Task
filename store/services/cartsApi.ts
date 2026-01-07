 
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Product } from "./productsApi"
import { API_BASE_URL } from "@/constants/api"


export interface CartProduct extends Product {
  quantity: number
}

export interface Cart {
  id: number
  userId: number
  products: CartProduct[]
}

export const cartsApi = createApi({
  reducerPath: "cartsApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCarts: builder.query<Cart[], void>({
      query: () => "/carts",
      providesTags: ["Cart"],
    }),
    getCartById: builder.query<Cart, number>({
      query: (id) => `/carts/${id}`,
      providesTags: (result, error, id) => [{ type: "Cart", id }],
    }),
    createCart: builder.mutation<Cart, Partial<Cart>>({
      query: (cart) => ({
        url: "/carts",
        method: "POST",
        body: cart,
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCart: builder.mutation<Cart, { id: number; cart: Partial<Cart> }>({
      query: ({ id, cart }) => ({
        url: `/carts/${id}`,
        method: "PUT",
        body: cart,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Cart", id }],
    }),
    deleteCart: builder.mutation<void, number>({
      query: (id) => ({
        url: `/carts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
})

export const {
  useGetCartsQuery,
  useGetCartByIdQuery,
  useCreateCartMutation,
  useUpdateCartMutation,
  useDeleteCartMutation,
} = cartsApi
