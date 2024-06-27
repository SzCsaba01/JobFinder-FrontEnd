import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SelfUnsubscriberBase } from '../../utils/SelfUnsubscriberBase';
import { JobRecommendationService } from '../../services/job-recommendation.service';
import { UserProfileService } from '../../services/user-profile.service';
import { CommonModule } from '@angular/common';
import { JobCardComponent } from '../job-card/job-card.component';
import { JobDetailsComponent } from '../job-details/job-details.component';
import { IJob } from '../../models/job/job.model';
import { Guid } from 'guid-typescript';
import { SavedJobService } from '../../services/saved-job.service';
import { takeUntil } from 'rxjs';
import { LoadingService } from '../../services/loading.service';
import { JobService } from '../../services/job.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-job-recommendations',
  standalone: true,
  imports: [CommonModule, JobCardComponent, JobDetailsComponent],
  templateUrl: './job-recommendations.component.html',
  styleUrl: './job-recommendations.component.scss',
})
export class JobRecommendationsComponent
  extends SelfUnsubscriberBase
  implements OnInit
{
  @ViewChild('scrollable') private scrollBarContainer = {} as ElementRef;
  private previousScroll = 0;

  isJobDetailsShowing = false;

  recommendedJobs: IJob[] = [];
  selectedJob: IJob = {} as IJob;

  private savedJobIds: Guid[] = [];

  constructor(
    private userProfileService: UserProfileService,
    private recommendationService: JobRecommendationService,
    private jobService: JobService,
    private savedJobService: SavedJobService,
    private loadingService: LoadingService,
    private errorHandlerService: ErrorHandlerService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loadingService.show();
    this.recommendationService
      .getRecommendedJobs()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((jobs) => {
        console.log(jobs);
        this.recommendedJobs = jobs;

        this.savedJobService
          .getSavedJobIds()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((savedJobs) => {
            this.savedJobIds = savedJobs;
            this.recommendedJobs.forEach((job) => {
              job.isSaved = this.savedJobIds.includes(job.id);
            });
            this.loadingService.hide();
          });
      });
  }

  onSelectJob(job: IJob): void {
    this.previousScroll = this.scrollBarContainer.nativeElement.scrollTop;
    this.selectedJob = job;
    if (this.selectedJob.description == null) {
      this.jobService
        .getJobDescription(this.selectedJob.id)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((description) => {
          this.selectedJob.description = description;
          this.isJobDetailsShowing = true;
          this.resetScroll();
        });
    } else {
      this.isJobDetailsShowing = true;
      this.resetScroll();
    }
  }

  onSave(job: IJob): void {
    if (job.isSaved) {
      this.savedJobIds.push(job.id);
      this.savedJobService
        .saveJob(job.id)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe();
    } else {
      this.savedJobIds = this.savedJobIds.filter((id) => id !== job.id);
      this.savedJobService
        .unsaveJob(job.id)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe();
    }
  }

  onDelete(job: IJob): void {
    this.jobService
      .deleteJob(job.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.loadData();
      });
  }

  onBack(): void {
    this.isJobDetailsShowing = false;
    this.scrollBarContainer.nativeElement.scrollTop = this.previousScroll;
  }

  onGetJobRecommendations(): void {
    this.loadingService.show();
    this.recommendationService
      .pollNewRecommendedJobs()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((jobs) => {
        console.log(jobs);
        jobs.forEach((job) => {
          job.isSaved = this.savedJobIds.includes(job.id);
        });
        this.recommendedJobs.unshift(...jobs);
        console.log(this.recommendedJobs);

        this.loadingService.hide();
      });

    this.userProfileService
      .recommendJobs()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  private resetScroll() {
    this.scrollBarContainer.nativeElement.scrollTop = 0;
  }
}
