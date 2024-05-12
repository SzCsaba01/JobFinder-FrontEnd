import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { IUserFeedback } from '../models/feedback/userFeedback.model';

@Injectable({
  providedIn: 'root'
})
export class UserFeedbackService {
  private _url = 'UserFeedback';

  constructor(private http: HttpClient) { }

  public getAllFeedbacks(): Observable<IUserFeedback[]> {
    return this.http.get<IUserFeedback[]>(`${environment.jobUrl}/${this._url}/GetAllFeedbacks`);
  }

  public getFeedbackByToken(token: string): Observable<IUserFeedback> {
    return this.http.get<IUserFeedback>(`${environment.jobUrl}/${this._url}/GetFeedbackByToken?token=${token}`);
  }

  public updateFeedback(feedback: IUserFeedback): Observable<any> {
    return this.http.put<any>(`${environment.jobUrl}/${this._url}/UpdateFeedback`, feedback);
  }
}
