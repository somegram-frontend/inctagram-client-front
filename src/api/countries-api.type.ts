type CountryData = {
    country: string;
    cities: string[];
};

export type ApiResponse = {
    error: boolean;
    msg: string;
    data: CountryData[];
};

export type CitiesApiResponse = {
    error: boolean;
    msg: string;
    data: string[];
};

export type GetCitiesRequest = {
    country: string;
};