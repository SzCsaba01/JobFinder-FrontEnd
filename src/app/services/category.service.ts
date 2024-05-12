import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { ICompany } from '../models/company/company.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private _url = 'Category';

  constructor(private http: HttpClient) { }

  public getAllCategories(): Observable<string[]> {
    return this.http.get<string[]>(
      `${environment.jobUrl}/${this._url}/GetAllCategories`
    );
  }

  public getMostAppliedCategoriesInLast30Days(): Observable<ICompany[]> {
    return this.http.get<ICompany[]>(
      `${environment.jobUrl}/${this._url}/GetMostAppliedCategoriesInLast30Days`
    );
  }

  public getMostSavedCategoriesInLast30Days(): Observable<ICompany[]> {
    return this.http.get<ICompany[]>(
      `${environment.jobUrl}/${this._url}/GetMostSavedCategoriesInLast30Days`
    );
  }
}
