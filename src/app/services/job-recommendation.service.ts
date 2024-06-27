import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IJob } from '../models/job/job.model';

@Injectable({
  providedIn: 'root',
})
export class JobRecommendationService {
  private _url = 'JobRecommendation';

  constructor(private http: HttpClient) {}

  public getRecommendedJobs(): Observable<IJob[]> {
    return this.http.get<IJob[]>(`${environment.jobUrl}/${this._url}/GetRecommendedJobs`);
  }

  public pollNewRecommendedJobs(): Observable<IJob[]> {
    return this.http.get<IJob[]>(`${environment.jobUrl}/${this._url}/PollNewRecommendedJobs`);
  }
}
