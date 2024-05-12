import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { IJobFilter } from '../models/job/jobFilter.model';
import { IJobFilterResult } from '../models/job/jobFilterResult.model';

@Injectable({
  providedIn: 'root',
})
export class SavedJobService {
  private _url = 'SavedJob';

  constructor(private http: HttpClient) {}

  public getFilteredSavedJobs(
    filteredJobsSearch: IJobFilter
  ): Observable<IJobFilterResult> {
    return this.http.post<IJobFilterResult>(
      `${environment.jobUrl}/${this._url}/GetFilteredSavedJobs`,
      filteredJobsSearch
    );
  }

  public getSavedJobIds() {
    return this.http.get<Guid[]>(
      `${environment.jobUrl}/${this._url}/GetSavedJobIds`
    );
  }

  public saveJob(jobId: Guid): Observable<any> {
    return this.http.post(
      `${environment.jobUrl}/${this._url}/SaveJob?jobId=${jobId}`,
      {}
    );
  }

  public unsaveJob(jobId: Guid): Observable<any> {
    return this.http.delete(
      `${environment.jobUrl}/${this._url}/UnsaveJob?jobId=${jobId}`
    );
  }
}
