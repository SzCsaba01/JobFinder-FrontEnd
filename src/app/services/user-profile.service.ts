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
    return this.http.get<IUserProfile>(`${environment.jobFinderUrl}/${this._url}/GetUserProfile`);
  }

  public editUserProfile(userProfile: IUserProfile) {
    return this.http.put(`${environment.jobFinderUrl}/${this._url}/EditUserProfile`, userProfile);
  }
}
