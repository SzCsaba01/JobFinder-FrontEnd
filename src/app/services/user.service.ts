import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserRegistration } from '../models/user/userRegistration.model';
import { UserChangePassword } from '../models/user/userChangePassword.model';
import { IFilteredUserSearch } from '../models/user/filteredUsersSearch.model';
import { IFilteredUsersPagination } from '../models/user/filteredUsersPagination.model';

const options = {
  responseType: 'text' as 'json',
};

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private _url = 'User';

  constructor(private http: HttpClient) { }

  public verifyIfResetPasswordTokenExists(resetPasswordToken: string) :  Observable<boolean>{
    return this.http.get<boolean>(`${environment.apiUrl}/${this._url}/VerifyIfResetPasswordTokenExists?resetPasswordToken=${resetPasswordToken}`);
  }

  public getFilteredUsersPaginated(filteredUsersSearch: IFilteredUserSearch) : Observable<IFilteredUsersPagination> {
    return this.http.put<IFilteredUsersPagination>(`${environment.apiUrl}/${this._url}/GetFilteredUsersPaginated`, filteredUsersSearch);
  }

  public changePassword(userChangePassword: UserChangePassword) {
    return this.http.put(`${environment.apiUrl}/${this._url}/ChangePassword`, userChangePassword);
  }

  public sendResetPasswordEmail(email: string) {
    return this.http.put(`${environment.apiUrl}/${this._url}/SendResetPasswordEmail?email=${email}`, {});
  }

  public verifyEmailByRegistrationToken(registrationToken: string) {
    const encodedToken = encodeURIComponent(registrationToken);
    return this.http.put(`${environment.apiUrl}/${this._url}/VerifyEmailByRegistrationToken?registrationToken=${encodedToken}`, {});
  }

  public register(user: UserRegistration) {
    return this.http.post(`${environment.apiUrl}/${this._url}/Register`, user);
  }

  public deleteUser(username: string) {
    return this.http.delete(`${environment.apiUrl}/${this._url}/DeleteUser?username=${username}`);
  }
}