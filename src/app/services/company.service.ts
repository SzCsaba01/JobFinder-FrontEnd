import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ICompany } from '../models/company/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private _url = 'Company';

  constructor(private http: HttpClient) { }

  public getAllCompanies(): Observable<string[]> {
    return this.http.get<string[]>(
      `${environment.jobUrl}/${this._url}/GetAllCompanies`
    );
  }

  public getMostVisitedCompaniesInLast30Days(): Observable<ICompany[]> {
    return this.http.get<ICompany[]>(
      `${environment.jobUrl}/${this._url}/GetMostVisitedCompaniesInLast30Days`
    );
  }

  public getMostSavedCompaniesInLast30Days(): Observable<ICompany[]> {
    return this.http.get<ICompany[]>(
      `${environment.jobUrl}/${this._url}/GetMostSavedCompaniesInLast30Days`
    );
  }
}
