import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ApiResponse, CitiesApiResponse, GetCitiesRequest } from './countries-api-outsourced.type'

export const countriesApiOutsources = createApi({
  reducerPath: 'countriesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://countriesnow.space/api/v0.1/' }),
  endpoints: builder => ({
    getCountriesList: builder.query<ApiResponse, void>({
      query: () => 'countries',
    }),
    getCitiesList: builder.mutation<CitiesApiResponse, GetCitiesRequest>({
      query: body => {
        return {
          url: 'countries/cities',
          method: 'POST',
          body,
        }
      },
    }),
  }),
})

export const { useGetCountriesListQuery, useGetCitiesListMutation } = countriesApiOutsources
