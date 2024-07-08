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
export class ExternalSourceVisitClickService {
  private _url = 'ExternalSourceVisitClick';

  constructor(private http: HttpClient) {}

  public getFilteredExternalSourceVisits(
    filteredJobsSearch: IJobFilter
  ): Observable<IJobFilterResult> {
    return this.http.post<IJobFilterResult>(
      `${environment.jobUrl}/${this._url}/GetFilteredExternalSourceVisits`,
      filteredJobsSearch
    );
  }

  public clickExternalSourceVisit(jobId: Guid): Observable<any> {
    return this.http.post(
      `${environment.jobUrl}/${this._url}/ClickExternalSourceVisit?jobId=${jobId}`,
      {}
    );
  }
}
