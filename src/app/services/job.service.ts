import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IJobFilter } from '../models/job/jobFilter.model';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { IJobFilterResult } from '../models/job/jobFilterResult.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private _url = 'Job';

  constructor(private http: HttpClient) { }

  public getFilteredJobsPaginated(filteredJobsSearch: IJobFilter): Observable<IJobFilterResult> {
    return this.http.post<IJobFilterResult>(`${environment.jobUrl}/${this._url}/GetFilteredJobsPaginated`, filteredJobsSearch);
  }
}
