export type Country = {
  id: string
  countryCode: string
  name: string
}

export type CountryResponse = Country[]

export type City = {
  id: string
  countryId: string
  name: StringConstructor
}

export type CityResponse = City[]
