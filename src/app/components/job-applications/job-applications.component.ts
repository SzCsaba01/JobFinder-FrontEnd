import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SelfUnsubscriberBase } from '../../utils/SelfUnsubscriberBase';
import { FormGroup, FormControl } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { takeUntil } from 'rxjs';
import { IJob } from '../../models/job/job.model';
import { IJobFilter } from '../../models/job/jobFilter.model';
import { IJobFilterResult } from '../../models/job/jobFilterResult.model';
import { ICountryStateCity } from '../../models/location/countryStateCity.model';
import { ILocation } from '../../models/location/location.model';
import { CountryStateCityService } from '../../services/country-state-city.service';
import { JobService } from '../../services/job.service';
import { LoadingService } from '../../services/loading.service';
import { SavedJobService } from '../../services/saved-job.service';
import { CommonModule } from '@angular/common';
import { angularMaterialModulesUtil } from '../../shared-modules/angular-material-modules.util';
import { formModulesUtil } from '../../shared-modules/form-modules.util';
import { JobCardComponent } from '../job-card/job-card.component';
import { JobDetailsComponent } from '../job-details/job-details.component';
import { JobApplicationClickService } from '../../services/job-application-click.service';

@Component({
  selector: 'app-job-applications',
  standalone: true,
  imports: [
    CommonModule,
    JobCardComponent,
    JobDetailsComponent,
    formModulesUtil(),
    angularMaterialModulesUtil(),
  ],
  templateUrl: './job-applications.component.html',
  styleUrl: './job-applications.component.scss'
})
export class JobApplicationsComponent extends SelfUnsubscriberBase implements OnInit {
  @ViewChild('scrollable') private scrollBarContainer = {} as ElementRef;
  private previousScroll = 0;
  
  jobs: IJobFilterResult = {} as IJobFilterResult;
  locations: ILocation[] = [];
  locationInput: string = '';
  selectedJob = {} as IJob;

  private savedJobIds: Guid[] = [];
  private currentTitleLength = 0;
  private previuesTitleLength = 0;

  totalPages = 0;
  visiblePages: number[] = [];

  jobFilter = {} as FormGroup;
  pageFormControl = {} as FormControl;
  pageSizeFormControl = {} as FormControl;
  contractTypeFormControl = {} as FormControl;
  titleFormControl = {} as FormControl;
  isRemoteFormControl = {} as FormControl;
  categoriesFormControl = {} as FormControl;
  companiesFormControl = {} as FormControl;
  countryFormControl = {} as FormControl;
  stateFormControl = {} as FormControl;
  cityFormControl = {} as FormControl;
  countryStateCity = {} as ICountryStateCity;

  isJobDetailsShowing = false;

  constructor(
    private jobService: JobService,
    private savedJobService: SavedJobService,
    private jobApplicationClickService: JobApplicationClickService,
    private countryStateCityService: CountryStateCityService,
    private loadingService: LoadingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadingService.show();
    this.initializeForm();
    this.initializeCountryStateCity();
    this.initializeJobs();
  }

  private initializeJobs(): void {
    this.jobApplicationClickService
      .getFilteredAppliedJobs(this.jobFilter.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((jobs) => {
        this.jobs = jobs;
        this.calculateTotalPages();
        this.calculateVisiblePages();

        this.savedJobService
          .getSavedJobIds()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((savedJobIds) => {
            this.savedJobIds = savedJobIds;
            this.jobs.jobs.forEach((job) => {
              job.isSaved = savedJobIds.includes(job.id);
            });
            this.loadingService.hide();
          });
      });
  }

  private initializeCountryStateCity(): void {
    this.countryStateCity.country = this.countryStateCityService.getCountries();

    this.countryFormControl.valueChanges.subscribe((country) => {
      this.stateFormControl.reset();
      this.stateFormControl.disable();
      if (country) {
        this.countryStateCity.state =
          this.countryStateCityService.getStatesByCountry(country);
        this.countryStateCity.countryCode = country;
        this.stateFormControl.enable();
      }
    });

    this.stateFormControl.valueChanges.subscribe((state) => {
      this.cityFormControl.reset();
      this.cityFormControl.disable();
      if (state) {
        this.countryStateCity.city =
          this.countryStateCityService.getCitiesByState(
            this.countryFormControl.value,
            state
          );
        this.cityFormControl.enable();
      }
    });
  }

  private initializeForm(): void {
    this.countryFormControl = new FormControl('');
    this.stateFormControl = new FormControl({ value: '', disabled: true });
    this.cityFormControl = new FormControl({ value: '', disabled: true });
    this.pageFormControl = new FormControl(0);
    this.pageSizeFormControl = new FormControl(10);
    this.contractTypeFormControl = new FormControl('');
    this.titleFormControl = new FormControl('');
    this.isRemoteFormControl = new FormControl(false);
    this.categoriesFormControl = new FormControl([]);
    this.companiesFormControl = new FormControl([]);

    this.jobFilter = new FormGroup({
      page: this.pageFormControl,
      pageSize: this.pageSizeFormControl,
      contractType: this.contractTypeFormControl,
      title: this.titleFormControl,
      isRemote: this.isRemoteFormControl,
      categories: this.categoriesFormControl,
      companies: this.companiesFormControl,
      country: this.countryFormControl,
      state: this.stateFormControl,
      city: this.cityFormControl,
    });
  }

  filterJobs(jobFilter: IJobFilter): void {
    this.previuesTitleLength = this.currentTitleLength;
    this.currentTitleLength = jobFilter.title.length;

    if (this.previuesTitleLength < 2 && this.currentTitleLength > this.previuesTitleLength) {
      return;
    }

    const filter = jobFilter;

    if (filter.title.length < 3) {
      filter.title = '';
    }

    filter.page = 0;
    this.jobApplicationClickService
      .getFilteredAppliedJobs(filter)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((jobs) => {
        if (
          this.previuesTitleLength == 2 &&
          this.currentTitleLength > this.previuesTitleLength
        ) {
          this.jobs = jobs;
        } else if (
          this.previuesTitleLength == 3 &&
          this.currentTitleLength < this.previuesTitleLength
        ) {
          this.jobs = jobs;
        } else {
          this.jobs.jobs = jobs.jobs;
          this.jobs.totalJobs = jobs.totalJobs;
        }

        this.jobs.jobs.forEach((job) => {
          job.isSaved = this.savedJobIds.includes(job.id);
        });

        this.pageFormControl.setValue(0);
        this.calculateTotalPages();
        this.calculateVisiblePages();
      });
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadingService.show();
      this.pageFormControl.setValue(page);
      this.calculateVisiblePages();
      this.jobApplicationClickService
        .getFilteredAppliedJobs(this.jobFilter.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((jobs) => {
          this.jobs = jobs;

          this.jobs.jobs.forEach((job) => {
            job.isSaved = this.savedJobIds.includes(job.id);
          });
          this.resetScroll();
          this.loadingService.hide();
        });
    }
  }

  private calculateTotalPages(): void {
    this.totalPages = Math.ceil(
      this.jobs.totalJobs / this.pageSizeFormControl.value
    );
  }

  private calculateVisiblePages(): void {
    const currentPage = this.pageFormControl.value;
    const visiblePageCount = 3;
    const pages: number[] = [];

    if (this.totalPages <= visiblePageCount + 1) {
      for (let i = 0; i < this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(
        0,
        currentPage - Math.floor(visiblePageCount / 2)
      );
      const endPage = Math.min(
        this.totalPages - 1,
        startPage + visiblePageCount - 1
      );

      if (startPage > 0) {
        pages.push(0);
        pages.push(-1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < this.totalPages - 1) {
        pages.push(-1);
        pages.push(this.totalPages - 1);
      }
    }

    this.visiblePages = pages;
  }

  onSelectJob(job: IJob): void {
    this.previousScroll = this.scrollBarContainer.nativeElement.scrollTop;
    this.selectedJob = job;
    if (this.selectedJob.description == null) {
      this.jobService
        .getJobDescription(job.id)
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


  onBack(): void {
    this.isJobDetailsShowing = false;
    this.scrollBarContainer.nativeElement.scrollTop = this.previousScroll;
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
    this.jobService.deleteJob(job.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.initializeJobs();
      });
  }

  private resetScroll() {
    this.scrollBarContainer.nativeElement.scrollTop = 0;
  }
}
