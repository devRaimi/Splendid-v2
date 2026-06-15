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
                url: '/api/order/create',
                method: 'POST',
                body: data
            })
        }),
        fetchOrder: builder.query({
            query: (data) => ({
                url: '/api/order/fetchAll',
                method: 'GET',
            })
        }),
        fetchOrderByRef: builder.query({
            query: (ref) => ({
                url: `/api/order/fetchOne/${ref}`,
                method: 'GET',
            })
        }),
        updateOrder: builder.mutation({
            query: ({data, ref}) => ({
                url: `/api/order/update/${ref}`,
                method: 'PUT',
                body: data
            })
        })
    })
})

export const {
    useCreateItemMutation,
    useFetchItemQuery,
} = itemApiSlice

export const {useCreateOrderMutation, useFetchOrderQuery, useUpdateOrderMutation, useFetchOrderByRefQuery, useLazyFetchOrderByRefQuery} = orderApiSlice