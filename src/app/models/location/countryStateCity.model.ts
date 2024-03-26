import { ICity, ICountry, IState } from "country-state-city";

export interface ICountryStateCity {
    country: ICountry[];
    countryCode: string;
    state: IState[];
    stateCode: string;
    city: ICity[];
}