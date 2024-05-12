import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Guid } from 'guid-typescript';
import { IJobFilterResult } from '../models/job/jobFilterResult.model';
import { IJobFilter } from '../models/job/jobFilter.model';

@Injectable({
  providedIn: 'root',
})
export class JobApplicationClickService {
  private _url = 'JobApplicationClick';

  constructor(private http: HttpClient) {}

  public getFilteredAppliedJobs(
    filteredJobsSearch: IJobFilter
  ): Observable<IJobFilterResult> {
    return this.http.post<IJobFilterResult>(
      `${environment.jobUrl}/${this._url}/GetFilteredAppliedJobs`,
      filteredJobsSearch
    );
  }

  public clickJobApplication(jobId: Guid): Observable<any> {
    return this.http.post(
      `${environment.jobUrl}/${this._url}/ClickJobApplication?jobId=${jobId}`,
      {}
    );
  }
}
