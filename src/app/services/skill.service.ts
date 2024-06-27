import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  private _url = 'Skill';

  constructor(private http: HttpClient) {}

  public getAllSkills(): Observable<string[]> {
    return this.http.get<string[]>(
      `${environment.jobFinderUrl}/${this._url}/GetAllSkills`
    );
  }
}
