import { Injectable } from '@angular/core';
import { City, Country, State } from 'country-state-city';

@Injectable({
  providedIn: 'root',
})
export class CountryStateCityService {
  getCountries() {
    return Country.getAllCountries();
  }

  getCountryByIsoCode(isoCode: string) {
    return Country.getCountryByCode(isoCode);
  }

  getStatesByCountry(country: string) {
    return State.getStatesOfCountry(country);
  }

  getCitiesByState(countryCode: string, stateCode: string) {
    return City.getCitiesOfState(countryCode, stateCode);
  }

  getStateNameByIsoCodeAndCountry(
    stateCode: string,
    countryCode: string
  ): string {
    const stateName = State.getStateByCodeAndCountry(stateCode, countryCode);
    if (stateName) {
      return stateName.name;
    }

    return '';
  }

  getCountryNameByIsoCode(countryCode: string): string {
    const countryName = Country.getCountryByCode(countryCode);
    if (countryName) {
      return countryName.name;
    }

    return '';
  }
}
