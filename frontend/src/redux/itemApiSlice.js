import { apiSlice } from './apiSlice';

export const itemApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createItem: builder.mutation({
            query: (data) => ({
                url: '/api/item/create',
                method: 'POST',
                body: data
            })
        }),
        fetchItem: builder.query({
            query: (data) => ({
                url: '/api/item/fetchAll',
                method: 'GET',
            })
        })
    })
})

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (data) => ({
                url: '/order/create',
                method: 'POST',
                body: data
            })
        }),
        fetchOrder: builder.query({
            query: (data) => ({
                url: '/order/fetchAll',
                method: 'GET',
            })
        }),
        updateOrder: builder.query({
            query: (data) => ({
                url: '/order/fetchAll',
                method: 'GET',
            })
        })
    })
})

export const {
    useCreateItemMutation,
    useFetchItemQuery,
} = itemApiSlice

export const {useCreateOrderMutation, useFetchOrderQuery, useUpdateOrderQuery} = orderApiSlice