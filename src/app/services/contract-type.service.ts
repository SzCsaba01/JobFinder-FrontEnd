import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ContractTypeService {
  private _url = 'ContractType';

  constructor(private http: HttpClient) { }

  public getAllContractTypes(): Observable<string[]> {
    return this.http.get<string[]>(
      `${environment.jobUrl}/${this._url}/GetAllContractTypes`
    );
  }
}
