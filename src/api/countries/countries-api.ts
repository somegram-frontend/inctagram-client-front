import { baseApi } from '../_base/base-api'
import { CityResponse, CountryResponse } from './countries-api.type'

export const countriesApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getCountriesList: builder.query<CountryResponse, void>({
        query: () => '/v1/country-catalog/country',
        providesTags: ['CountryCatalog'],
      }),
      getCitiesList: builder.query<CityResponse, string>({
        query: countryId => `/v1/country-catalog/${countryId}/city`,
        providesTags: ['CountryCatalog'],
      }),
    }
  },
})

export const { useGetCitiesListQuery, useGetCountriesListQuery } = countriesApi
