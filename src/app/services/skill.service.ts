import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  private _url = 'Skill';

  constructor(private http: HttpClient) {}

  public getAllSkills(): Observable<string[]> {
    return this.http.get<string[]>(
      `${environment.userUrl}/${this._url}/GetAllSkills`
    );
  }
}
