import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { formModulesUtil } from '../../shared-modules/form-modules.util';
import { SelfUnsubscriberBase } from '../../utils/SelfUnsubscriberBase';
import { JobService } from '../../services/job.service';
import { IJobFilterResult } from '../../models/job/jobFilterResult.model';
import { IJobFilter } from '../../models/job/jobFilter.model';
import { JobCardComponent } from "../job-card/job-card.component";
import { CountryStateCityService } from '../../services/country-state-city.service';
import { ILocation } from '../../models/location/location.model';
import { FormControl, FormGroup } from '@angular/forms';
import { ICountryStateCity } from '../../models/location/countryStateCity.model';
import { angularMaterialModulesUtil } from '../../shared-modules/angular-material-modules.util';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [CommonModule, formModulesUtil(), angularMaterialModulesUtil(), JobCardComponent]
})
export class HomeComponent extends SelfUnsubscriberBase implements OnInit {

  jobs: IJobFilterResult = {} as IJobFilterResult;
  locations: ILocation[] = [];
  locationInput: string = '';

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


  constructor(
    private jobService: JobService,
    private countryStateCityService: CountryStateCityService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.initializeCountryStateCity();

    this.jobService.getFilteredJobsPaginated(this.jobFilter.value).subscribe(jobs => {
      this.jobs = jobs;
      this.initializePages();
    });
  }

  private initializeCountryStateCity(): void {
    this.countryStateCity.country = this.countryStateCityService.getCountries();

    this.countryFormControl.valueChanges.subscribe((country) => {
      this.stateFormControl.reset();
      this.stateFormControl.disable();
      if (country) {
        this.countryStateCity.state = this.countryStateCityService.getStatesByCountry(country);
        this.countryStateCity.countryCode = country;
        this.stateFormControl.enable();
      }
    });

    this.stateFormControl.valueChanges.subscribe((state) => {
      this.cityFormControl.reset();
      this.cityFormControl.disable();
      if (state) {
        this.countryStateCity.city = this.countryStateCityService.getCitiesByState(this.countryFormControl.value, state);
        this.cityFormControl.enable();
      }
    });
  }


  private initializeForm(): void {
    this.countryFormControl = new FormControl('');
    this.stateFormControl = new FormControl({ value: '', disabled: true }, );
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
      city: this.cityFormControl
    });
  }

  filterJobs(jobFilter: IJobFilter): void {
    const filter = jobFilter;

    if (filter.title.length < 3) {
      filter.title = '';
    }

    filter.page = 0;
    if (jobFilter.page >= 0 && jobFilter.page < this.totalPages) {
      this.jobService.getFilteredJobsPaginated(jobFilter)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(jobs => {
          this.jobs = jobs;
          this.pageFormControl.setValue(0);
          this.initializePages();
      });
    }
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
        this.pageFormControl.setValue(page);
        this.jobService.getFilteredJobsPaginated(this.jobFilter.value)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(jobs => {
            this.jobs = jobs;
        });
    }
  }

  private initializePages(): void {
    this.totalPages = Math.ceil(this.jobs.totalJobs / this.pageSizeFormControl.value);

    const currentPage = this.pageFormControl.value;
    const visiblePageCount = 3;
    const pages: number[] = [];

    if (this.totalPages <= visiblePageCount + 1) {
        for (let i = 0; i < this.totalPages; i++) {
            pages.push(i);
        }
    } else {
        const startPage = Math.max(0, currentPage - Math.floor(visiblePageCount / 2));
        const endPage = Math.min(this.totalPages - 1, startPage + visiblePageCount - 1);
        
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
}
