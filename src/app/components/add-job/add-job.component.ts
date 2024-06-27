import { Component, OnInit } from '@angular/core';
import { SelfUnsubscriberBase } from '../../utils/SelfUnsubscriberBase';
import { CategoryService } from '../../services/category.service';
import { CompanyService } from '../../services/company.service';
import { ContractTypeService } from '../../services/contract-type.service';
import { JobService } from '../../services/job.service';
import { takeUntil } from 'rxjs';
import { LoadingService } from '../../services/loading.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { angularMaterialModulesUtil } from '../../shared-modules/angular-material-modules.util';
import { formModulesUtil } from '../../shared-modules/form-modules.util';
import { TagService } from '../../services/tag.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { CountryStateCityService } from '../../services/country-state-city.service';
import { ICountryStateCity } from '../../models/location/countryStateCity.model';
import { ILocation } from '../../models/location/location.model';
import { urlFormat } from '../../formats/formats';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-add-job',
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    angularMaterialModulesUtil(),
    formModulesUtil(),
  ],
  templateUrl: './add-job.component.html',
  styleUrl: './add-job.component.scss',
})
export class AddJobComponent extends SelfUnsubscriberBase implements OnInit {
  categories: string[] = [];
  companies: string[] = [];
  contractTypes: string[] = [];
  tags: string[] = [];
  countryStateCity = {} as ICountryStateCity;
  locations: ILocation[] = [];

  formData: FormData = new FormData();
  companyLogoUrl: string = '';

  jobForm: FormGroup = {} as FormGroup;
  jobTitleFormControl: FormControl = {} as FormControl;
  jobDescriptionFormControl: FormControl = {} as FormControl;
  jobUrlFormControl: FormControl = {} as FormControl;
  jobCategoriesFormControl: FormControl = {} as FormControl;
  jobTagsFormControl: FormControl = {} as FormControl;
  jobCompanyNameFormControl: FormControl = {} as FormControl;
  jobCompanyLogoFormControl: FormControl = {} as FormControl;
  jobContractTypeFormControl: FormControl = {} as FormControl;
  jobIsRemoteFormControl: FormControl = {} as FormControl;

  locationFormGroup: FormGroup = {} as FormGroup;
  countryFormControl: FormControl = {} as FormControl;
  stateFormControl: FormControl = {} as FormControl;
  cityFormControl: FormControl = {} as FormControl;

  constructor(
    private categoryService: CategoryService,
    private companyService: CompanyService,
    private contractTypeService: ContractTypeService,
    public countryStateCityService: CountryStateCityService,
    private tagService: TagService,
    private jobService: JobService,
    private loadingService: LoadingService,
    private errorHandlerService: ErrorHandlerService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadingService.show();
    this.initializeJobForm();
    this.initializeLocationForm();
    this.initializeCountryStateCity();
    this.loadData();
  }

  private loadData(): void {
    this.categoryService
      .getAllCategories()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((categories) => {
        this.categories = categories;
      });

    this.companyService
      .getAllCompanies()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((companies) => {
        this.companies = companies;
      });

    this.contractTypeService
      .getAllContractTypes()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((contractTypes) => {
        this.contractTypes = contractTypes;
      });

    this.tagService
      .getAllTags()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((tags) => {
        this.tags = tags;
        this.loadingService.hide();
      });
  }

  private initializeJobForm(): void {
    this.jobTitleFormControl = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]);
    this.jobDescriptionFormControl = new FormControl('');
    this.jobUrlFormControl = new FormControl('', [
      Validators.required,
      Validators.pattern(urlFormat),
    ]);
    this.jobCategoriesFormControl = new FormControl('', Validators.required);
    this.jobTagsFormControl = new FormControl('');
    this.jobCompanyNameFormControl = new FormControl('', Validators.required);
    this.jobCompanyLogoFormControl = new FormControl('');
    this.jobContractTypeFormControl = new FormControl('', Validators.required);
    this.jobIsRemoteFormControl = new FormControl(false);

    this.jobForm = new FormGroup({
      title: this.jobTitleFormControl,
      description: this.jobDescriptionFormControl,
      url: this.jobUrlFormControl,
      categories: this.jobCategoriesFormControl,
      tags: this.jobTagsFormControl,
      companyName: this.jobCompanyNameFormControl,
      companyLogo: this.jobCompanyLogoFormControl,
      contractType: this.jobContractTypeFormControl,
      isRemote: this.jobIsRemoteFormControl,
    });
  }

  private initializeLocationForm(): void {
    this.countryFormControl = new FormControl('', Validators.required);
    this.stateFormControl = new FormControl({ value: '', disabled: true });
    this.cityFormControl = new FormControl({ value: '', disabled: true });

    this.locationFormGroup = new FormGroup({
      country: this.countryFormControl,
      state: this.stateFormControl,
      city: this.cityFormControl,
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

  onUploadImage(event: any): void {
    if (event.target.files.length === 0) return;
    const file = event.target.files[0];

    if (file.type.split('/')[0] !== 'image') {
      this.errorHandlerService.showMessage('Only image files are allowed!', 'error');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.companyLogoUrl = reader.result as string;
    };

    this.formData.append('CompanyLogoFile', file);
  }

  onDeselectImage(): void {
    this.jobForm.get('companyLogo')?.setValue(null);
    this.companyLogoUrl = '';
  }

  onAddLocation(): void {
    const location = {
      countryIso2Code: this.countryFormControl.value,
      stateCode: this.stateFormControl.value,
      city: this.cityFormControl.value,
    } as ILocation;

    this.locations.push(location);

    this.countryFormControl.reset();
    this.stateFormControl.reset();
    this.cityFormControl.reset();
    this.cityFormControl.disable();
  }

  onDeleteLocation(location: any): void {
    const index = this.locations.indexOf(location);
    if (index !== -1) {
      this.locations.splice(index, 1);
    }
  }

  onSubmit(): void {
    this.loadingService.show();

    this.formData.append('Title', this.jobTitleFormControl.value);
    this.formData.append('Description', this.jobDescriptionFormControl.value);
    this.formData.append('CompanyName', this.jobCompanyNameFormControl.value);
    this.formData.append('Url', this.jobUrlFormControl.value);
    this.formData.append('IsRemote', this.jobIsRemoteFormControl.value);
    this.formData.append('ContractTypeName', this.jobContractTypeFormControl.value);
    
    for (let i = 0; i < this.locations.length; i++) {
      const location = this.locations[i];
      if (location.city) {
        this.formData.append(`Locations[${i}].city`, location.city);
      }

      if (location.stateCode) {
        this.formData.append(`Locations[${i}].stateCode`, location.stateCode);
      }

      if(location.countryIso2Code) {
        this.formData.append(`Locations[${i}].countryIso2Code`, location.countryIso2Code);
      }

    }

    this.jobCategoriesFormControl.value.forEach((category: string) => {
      this.formData.append('Categories', category);
    });

    this.jobTagsFormControl.value.forEach((tag: string) => {
      this.formData.append('Tags', tag);
    });

    this.jobService
      .addJob(this.formData)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.loadingService.hide();

        this.jobForm.reset();
        this.jobTitleFormControl.reset();
        this.jobDescriptionFormControl.reset();
        this.jobUrlFormControl.reset();
        this.jobCategoriesFormControl.reset();
        this.jobTagsFormControl.reset();
        this.jobCompanyNameFormControl.reset();
        this.jobCompanyLogoFormControl.reset();
        this.jobContractTypeFormControl.reset();
        this.jobIsRemoteFormControl.reset();

        this.locationFormGroup.reset();
        this.locations = [];
        this.companyLogoUrl = '';
        this.formData = new FormData();
      },
      () => {
        this.loadingService.hide();

        this.jobForm.reset();
        this.jobTitleFormControl.reset();
        this.jobDescriptionFormControl.reset();
        this.jobUrlFormControl.reset();
        this.jobCategoriesFormControl.reset();
        this.jobTagsFormControl.reset();
        this.jobCompanyNameFormControl.reset();
        this.jobCompanyLogoFormControl.reset();
        this.jobContractTypeFormControl.reset();
        this.jobIsRemoteFormControl.reset();

        this.locationFormGroup.reset();
        this.locations = [];
        this.companyLogoUrl = '';
        this.formData = new FormData();
      });
  }
}
