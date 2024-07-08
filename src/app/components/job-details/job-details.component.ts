import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelfUnsubscriberBase } from '../../utils/SelfUnsubscriberBase';
import { IJob } from '../../models/job/job.model';
import { CountryStateCityService } from '../../services/country-state-city.service';
import { CommonModule } from '@angular/common';
import { ExternalSourceVisitClickService } from '../../services/external-source-visit-click.service';
import { takeUntil } from 'rxjs';
import { userRoles } from '../../constants/user-roles';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.scss',
})
export class JobDetailsComponent extends SelfUnsubscriberBase implements OnInit{
  @Input() job: IJob = {} as IJob;
  @Output() onBack = new EventEmitter<void>();
  @Output() onSaveJob = new EventEmitter<IJob>();
  @Output() onDeleteJob = new EventEmitter<IJob>();

  userRole: string | unknown;
  userRoles = userRoles;

  constructor(
    public countryStateCityService: CountryStateCityService,
    private jobApplicationClickService: ExternalSourceVisitClickService,
    private authenticationService: AuthenticationService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.userRole = this.authenticationService.getUserRole();
  }

  getRelativeTime(dateString: Date): string {
    const datePosted = new Date(dateString);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - datePosted.getTime();
    const secondsDifference = Math.floor(timeDifference / 1000);

    if (secondsDifference < 60) {
      return (
        secondsDifference +
        ' second' +
        (secondsDifference === 1 ? '' : 's') +
        ' ago'
      );
    }
    const minutesDifference = Math.floor(secondsDifference / 60);
    if (minutesDifference < 60) {
      return (
        minutesDifference +
        ' minute' +
        (minutesDifference === 1 ? '' : 's') +
        ' ago'
      );
    }
    const hoursDifference = Math.floor(minutesDifference / 60);
    if (hoursDifference < 24) {
      return (
        hoursDifference + ' hour' + (hoursDifference === 1 ? '' : 's') + ' ago'
      );
    }
    const daysDifference = Math.floor(hoursDifference / 24);
    if (daysDifference < 7) {
      return (
        daysDifference + ' day' + (daysDifference === 1 ? '' : 's') + ' ago'
      );
    }
    const weeksDifference = Math.floor(daysDifference / 7);
    if (weeksDifference < 4) {
      return (
        weeksDifference + ' week' + (weeksDifference === 1 ? '' : 's') + ' ago'
      );
    }
    const monthsDifference = Math.floor(daysDifference / 30);
    return (
      monthsDifference + ' month' + (monthsDifference === 1 ? '' : 's') + ' ago'
    );
  }

  onBackClick(): void {
    this.onBack.emit();
  }

  onSave(): void {
    this.job.isSaved = !this.job.isSaved;
    this.onSaveJob.emit(this.job);
  }

  onApply(): void {
    this.jobApplicationClickService
      .clickExternalSourceVisit(this.job.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
    window.open(this.job.url, '_blank');
  }

  onDelete(): void {
    this.onDeleteJob.emit(this.job);
  }
}
