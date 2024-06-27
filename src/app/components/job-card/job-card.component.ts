import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IJob } from '../../models/job/job.model';
import { CommonModule } from '@angular/common';
import { CountryStateCityService } from '../../services/country-state-city.service';
import { AuthenticationService } from '../../services/authentication.service';
import { userRoles } from '../../constants/user-roles';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.scss',
})
export class JobCardComponent implements OnInit{
  @Input() job: IJob | undefined;
  @Output() onJobSelect = new EventEmitter<IJob>();
  @Output() onSaveJob = new EventEmitter<IJob>();
  @Output() onDeleteJob = new EventEmitter<IJob>();

  userRole: string | unknown;
  userRoles = userRoles;

  constructor(public countryStateCityService: CountryStateCityService,
    private authenticationService: AuthenticationService,
  ) {}

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
    const monthsDifference = Math.floor(daysDifference / 30);
    if (weeksDifference < 4 && monthsDifference < 1) {
      return (
        weeksDifference + ' week' + (weeksDifference === 1 ? '' : 's') + ' ago'
      );
    }
    return (
      monthsDifference + ' month' + (monthsDifference === 1 ? '' : 's') + ' ago'
    );
  }

  onSelectJob(): void {
    this.onJobSelect.emit(this.job);
  }

  onSave(): void {
    if (!this.job) {
      return;
    }

    this.job.isSaved = !this.job.isSaved;
    this.onSaveJob.emit(this.job);
  }

  onDelete(): void {
    if (!this.job) {
      return;
    }

    this.onDeleteJob.emit(this.job);
  }
}
