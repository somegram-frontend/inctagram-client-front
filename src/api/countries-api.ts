import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ApiResponse } from './countries-api.type'

export const countriesApi = createApi({
    reducerPath: 'countriesApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://countriesnow.space/api/v0.1/' }),
    endpoints: (builder) => ({
        getCountriesList: builder.query<ApiResponse, void>({
            query: () => 'countries',
        }
        ),
    }),
})

export const { useGetCountriesListQuery } = countriesApi