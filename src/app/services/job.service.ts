import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IJobFilter } from '../models/job/jobFilter.model';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { IJobFilterResult } from '../models/job/jobFilterResult.model';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private _url = 'Job';
  private options = {
    responseType: 'text' as 'json',
  };

  constructor(private http: HttpClient) { }

  public getFilteredJobsPaginated(filteredJobsSearch: IJobFilter): Observable<IJobFilterResult> {
    return this.http.post<IJobFilterResult>(`${environment.jobUrl}/${this._url}/GetFilteredJobsPaginated`, filteredJobsSearch);
  }

  public getJobDescription(jobId: Guid): Observable<any> {
    return this.http.get<any>(`${environment.jobUrl}/${this._url}/GetJobDescription?jobId=${jobId}`, this.options);
  }

  public addJob(job: FormData): Observable<any> {
    return this.http.post<any>(`${environment.jobUrl}/${this._url}/AddJob`, job);
  }

  public deleteJob(jobId: Guid): Observable<any> {
    return this.http.delete<any>(`${environment.jobUrl}/${this._url}/DeleteJob/${jobId}`);
  }
}
