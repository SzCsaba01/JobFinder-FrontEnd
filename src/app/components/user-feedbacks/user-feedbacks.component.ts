import { Component, OnInit } from '@angular/core';
import { SelfUnsubscriberBase } from '../../utils/SelfUnsubscriberBase';
import { IUserFeedbackFilterResult } from '../../models/feedback/userFeedbackFilterResult.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserFeedbackService } from '../../services/user-feedback.service';
import { CommonModule } from '@angular/common';
import { angularMaterialModulesUtil } from '../../shared-modules/angular-material-modules.util';
import { formModulesUtil } from '../../shared-modules/form-modules.util';
import { IUserFeedbackFilter } from '../../models/feedback/userFeedbackFilter.model';
import { ApplicationStatus } from '../../enums/applicationStatus.enum';
import { provideNativeDateAdapter } from '@angular/material/core';
import { LoadingService } from '../../services/loading.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-user-feedbacks',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, formModulesUtil(), angularMaterialModulesUtil()],
  templateUrl: './user-feedbacks.component.html',
  styleUrl: './user-feedbacks.component.scss',
})
export class UserFeedbacksComponent
  extends SelfUnsubscriberBase
  implements OnInit
{
  userFeedbackFilterResult = {} as IUserFeedbackFilterResult;

  userFeedbackFilterFormGroup = {} as FormGroup;

  companiesFormControl = {} as FormControl;
  categoriesFormControl = {} as FormControl;
  contractTypesFormControl = {} as FormControl;
  jobIdFormControl = {} as FormControl;
  startDateFormControl = {} as FormControl;
  endDateFormControl = {} as FormControl;
  minRatingFormControl = {} as FormControl;
  maxRatingFormControl = {} as FormControl;
  applicationStatusFormControl = {} as FormControl;

  private initialStartDate = new Date(
    new Date().setMonth(new Date().getMonth() - 1)
  );
  private initialEndDate = new Date();
  private wasPrevioslyJobSelected = false;

  applicationStatus = ApplicationStatus;

  minDate = {} as Date;
  maxDate = {} as Date;

  applicationStatuses = [
    { value: ApplicationStatus.Pending, label: 'Pending' },
    { value: ApplicationStatus.Applied, label: 'Applied' },
    { value: ApplicationStatus.Interviewed, label: 'Interviewed' },
    { value: ApplicationStatus.Hired, label: 'Hired' },
    { value: ApplicationStatus.Rejected, label: 'Rejected' },
    { value: ApplicationStatus['Not Interested'], label: 'Not Interested' },
  ];

  applicationStatusChart = {} as any;
  ratingChart = {} as any;

  constructor(
    private userFeedbackService: UserFeedbackService,
    private loadingService: LoadingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadingService.show();
    Chart.register(...registerables);
    this.initializeForm();
    this.loadData();
  }

  private loadData(): void {
    this.startDateFormControl.setValue(this.initialStartDate);
    this.endDateFormControl.setValue(this.initialEndDate);

    this.userFeedbackService
      .getFilteredFeedbacks(this.userFeedbackFilterFormGroup.value)
      .subscribe((result) => {
        this.userFeedbackFilterResult = result;
        this.initializeRatingChart();
        this.initializeApplicationStatusChart();
        this.loadingService.hide();
      });
  }

  private initializeForm(): void {
    this.minDate = new Date(2024, 0, 1);
    this.maxDate = new Date(new Date());

    this.companiesFormControl = new FormControl();
    this.categoriesFormControl = new FormControl();
    this.contractTypesFormControl = new FormControl();
    this.jobIdFormControl = new FormControl();
    this.startDateFormControl = new FormControl<Date | null>(null);
    this.endDateFormControl = new FormControl<Date | null>(null);
    this.minRatingFormControl = new FormControl();
    this.maxRatingFormControl = new FormControl();
    this.applicationStatusFormControl = new FormControl();

    this.userFeedbackFilterFormGroup = new FormGroup({
      companies: this.companiesFormControl,
      categories: this.categoriesFormControl,
      contractTypes: this.contractTypesFormControl,
      jobId: this.jobIdFormControl,
      startDate: this.startDateFormControl,
      endDate: this.endDateFormControl,
      minRating: this.minRatingFormControl,
      maxRating: this.maxRatingFormControl,
      applicationStatuses: this.applicationStatusFormControl,
    });
  }

  filterFeedbacks(userFeedbackFilter: IUserFeedbackFilter): void {
    this.userFeedbackService
      .getFilteredFeedbacks(userFeedbackFilter)
      .subscribe((result) => {
        if (
          userFeedbackFilter.jobId ||
          userFeedbackFilter.startDate != this.initialStartDate ||
          userFeedbackFilter.endDate != this.initialEndDate
        ) {
          this.initialEndDate = userFeedbackFilter.endDate;
          this.initialStartDate = userFeedbackFilter.startDate;
          if (userFeedbackFilter.jobId) {
            this.wasPrevioslyJobSelected = true;
            this.userFeedbackFilterResult.categories = result.categories;
            this.userFeedbackFilterResult.contractTypes = result.contractTypes;
            this.userFeedbackFilterResult.companies = result.companies;
            this.userFeedbackFilterResult.feedbacks = result.feedbacks;
          } else {
            this.wasPrevioslyJobSelected = false;
            this.userFeedbackFilterResult = result;
          }
        } else {
          this.initialEndDate = userFeedbackFilter.endDate;
          this.initialStartDate = userFeedbackFilter.startDate;

          if (this.wasPrevioslyJobSelected) {
            this.wasPrevioslyJobSelected = false;
            this.userFeedbackFilterResult.categories = result.categories;
            this.userFeedbackFilterResult.contractTypes = result.contractTypes;
            this.userFeedbackFilterResult.companies = result.companies;
          }

          this.userFeedbackFilterResult.feedbacks = result.feedbacks;
          this.userFeedbackFilterResult.jobs = result.jobs;
        }
        this.updateRatingChart();
        this.updateApplicationStatusChart();
      });
  }

  private getApplicationStatusCount(): { [key: number]: number } {
    const applicationStatuses = this.userFeedbackFilterResult.feedbacks.map(
      (feedback) => feedback.applicationStatus
    );

    const applicationStatusCounts = applicationStatuses.reduce(
      (acc: { [key: number]: number }, status) => {
        if (acc[status]) {
          acc[status]++;
        } else {
          acc[status] = 1;
        }
        return acc;
      },
      {}
    );

    return applicationStatusCounts;
  }

  private initializeApplicationStatusChart(): void {
    const applicationStatusCounts = this.getApplicationStatusCount();
    const applicationStatusLables = Object.keys(applicationStatusCounts).map(
      (key) => this.applicationStatus[key as keyof typeof ApplicationStatus]
    );
    const ctx = document.getElementById(
      'application-status-chart'
    ) as HTMLCanvasElement;
    const applicationStatusChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: applicationStatusLables,
        datasets: [
          {
            data: Object.values(applicationStatusCounts),
            backgroundColor: [
              '#FFEB3B',
              '#FF9800',
              '#2196F3',
              '#4CAF50',
              '#F44336',
              '#9E9E9E',
            ],
            hoverBackgroundColor: [
              '#FFF176',
              '#FFB74D',
              '#64B5F6',
              '#81C784',
              '#E57373',
              '#E0E0E0',
            ],
          },
        ],
      },
    });

    this.applicationStatusChart = applicationStatusChart;
  }

  private calculateRatingAverage(): {
    [key: string]: { total: number; count: number };
  } {
    const aggregatedData = {} as {
      [key: string]: { total: number; count: number };
    };
    this.userFeedbackFilterResult.feedbacks.forEach((data) => {
      const dateKey = new Date(data.feedbackDate).toDateString();
      if (!aggregatedData[dateKey]) {
        aggregatedData[dateKey] = { total: data.companyRating, count: 1 };
      } else {
        aggregatedData[dateKey].total += data.companyRating;
        aggregatedData[dateKey].count++;
      }
    });
    return aggregatedData;
  }

  private initializeRatingChart(): void {
    const aggregatedData = this.calculateRatingAverage();
    const labels = Object.keys(aggregatedData);
    const data = labels.map((key) => {
      return (aggregatedData[key].total / aggregatedData[key].count).toFixed(2);
    });
    const ctx = document.getElementById('rating-chart') as HTMLCanvasElement;
    const ratingChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Rating',
            data: data,
            fill: false,
            borderColor: '#2196F3',
            tension: 0.1,
          },
        ],
      },
    });

    this.ratingChart = ratingChart;
  }

  private updateRatingChart(): void {
    const aggregatedData = this.calculateRatingAverage();
    const labels = Object.keys(aggregatedData);
    const data = labels.map((key) => {
      return aggregatedData[key].total / aggregatedData[key].count;
    });

    this.ratingChart.data.labels = labels;
    this.ratingChart.data.datasets[0].data = data;
    this.ratingChart.update();
  }

  private updateApplicationStatusChart(): void {
    const applicationStatusCounts = this.getApplicationStatusCount();
    const applicationStatusLables = Object.keys(applicationStatusCounts).map(
      (key) => this.applicationStatus[key as keyof typeof ApplicationStatus]
    );
    this.applicationStatusChart.data.labels = applicationStatusLables;
    this.applicationStatusChart.data.datasets[0].data = Object.values(
      applicationStatusCounts
    );
    this.applicationStatusChart.update();
  }
}
