import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationRequest } from '../models/authentication/authenticationRequest.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _url = 'Authentication';
  private options = {
    responseType: 'text' as 'json',
  };

  constructor(
    private http: HttpClient,
    private route: Router
  ) { }

  public login(userAuthentication: AuthenticationRequest){
    return this.http
      .post<string>(`${environment.jobFinderUrl}/${this._url}/Login`, userAuthentication, this.options)
      .pipe(
        map((role : string) => {
          localStorage.setItem('role', role);
          return role;
        })
      );
  }

  public logout(){
    localStorage.removeItem('role');
    this.route.navigate(['']);

    return this.http.post<any>(`${environment.jobFinderUrl}/${this._url}/Logout`, {});
  }

  public isAuthenticated(){
    return !!localStorage.getItem('role');
  }

  public getUserRole(){
    return localStorage.getItem('role');
  }
}
