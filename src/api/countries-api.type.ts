type CountryData = {
    country: string;
    cities: string[];
};

export type ApiResponse = {
    error: boolean;
    msg: string;
    data: CountryData[];
};