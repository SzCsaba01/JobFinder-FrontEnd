import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { IUserProfile } from '../models/profile/user.profile.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private _url = 'UserProfile';

  constructor(private http: HttpClient) { }

  public getUserProfile() : Observable<IUserProfile> {
    return this.http.get<IUserProfile>(`${environment.userUrl}/${this._url}/GetUserProfile`);
  }

  public editUserProfile(userProfile: FormData, updateDataFromCV: boolean) {
    return this.http.put(`${environment.userUrl}/${this._url}/EditUserProfile?updateDataFromCV=${updateDataFromCV}`, userProfile);
  }

  public recommendJobs() {
    return this.http.post(`${environment.userUrl}/${this._url}/RecommendJobs`, null);
  }
}
