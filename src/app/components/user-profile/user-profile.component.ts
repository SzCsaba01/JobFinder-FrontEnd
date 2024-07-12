import { Component, OnInit } from '@angular/core';
import { SelfUnsubscriberBase } from '../../utils/SelfUnsubscriberBase';
import { UserProfileService } from '../../services/user-profile.service';
import { takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { formModulesUtil } from '../../shared-modules/form-modules.util';
import { IUserProfile } from '../../models/profile/user.profile.model';
import { CountryStateCityService } from '../../services/country-state-city.service';
import { ICountryStateCity } from '../../models/location/countryStateCity.model';
import { angularMaterialModulesUtil } from '../../shared-modules/angular-material-modules.util';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { LoadingService } from '../../services/loading.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { SkillService } from '../../services/skill.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    formModulesUtil(),
    angularMaterialModulesUtil(),
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent
  extends SelfUnsubscriberBase
  implements OnInit
{
  formData: FormData = {} as FormData;

  fileName: string = '';

  allSkills: string[] = [];

  editUserProfileFormGroup = {} as FormGroup;
  username = {} as FormControl;
  email = {} as FormControl;
  firstName = {} as FormControl;
  lastName = {} as FormControl;
  country = {} as FormControl;
  state = {} as FormControl;
  city = {} as FormControl;
  education = {} as FormControl;
  experience = {} as FormControl;
  skills = {} as FormControl;
  updateDataFromCV = {} as FormControl;

  private userProfile = {} as IUserProfile;
  private initialFileName: string = '';

  countryStateCity = {} as ICountryStateCity;

  constructor(
    private formBuilder: FormBuilder,
    private userProfileService: UserProfileService,
    private countryStateCityService: CountryStateCityService,
    private skillService: SkillService,
    private loadingService: LoadingService,
    private errorHandlerService: ErrorHandlerService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadingService.show();
    this.initializeForm();
    this.initializeCountryStateCity();
    this.loadData();
  }

  private loadData(): void {
    this.userProfileService
      .getUserProfile()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userProfile) => {
        this.userProfile = userProfile;
        this.skillService
          .getAllSkills()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((skills) => {
            this.allSkills = skills;
          });
        this.initializeFormGroupValues(userProfile);
        if (userProfile.userCV) {
          this.fileName = this.getFileNameFromPath(userProfile.userCV);
          this.initialFileName = this.fileName;
        }
        this.loadingService.hide();
      });
  }

  private getFileNameFromPath(filePath: string): string {
    const normalizedPath = filePath.replace(/\\/g, '/'); 
    return normalizedPath.split('/').pop() || '';
}

  private initializeCountryStateCity(): void {
    this.countryStateCity.country = this.countryStateCityService.getCountries();

    this.country.valueChanges.subscribe((country) => {
      this.state.reset();
      this.state.disable();
      if (country) {
        this.countryStateCity.state =
          this.countryStateCityService.getStatesByCountry(country);
        this.countryStateCity.countryCode = country;
        this.state.enable();
      }
    });

    this.state.valueChanges.subscribe((state) => {
      this.city.reset();
      this.city.disable();
      if (state) {
        this.countryStateCity.city =
          this.countryStateCityService.getCitiesByState(
            this.country.value,
            state
          );
        this.city.enable();
      }
    });
  }

  private initializeForm(): void {
    this.username = new FormControl({ value: '', disabled: true });
    this.email = new FormControl({ value: '', disabled: true });
    this.firstName = new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
    ]);
    this.lastName = new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
    ]);
    this.country = new FormControl('');
    this.state = new FormControl({ value: '', disabled: true });
    this.city = new FormControl({ value: '', disabled: true });
    this.education = new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(1000),
    ]);
    this.experience = new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(1000),
    ]);
    this.skills = new FormControl('');
    this.updateDataFromCV = new FormControl(false);

    this.editUserProfileFormGroup = this.formBuilder.group({
      username: this.username,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      country: this.country,
      state: this.state,
      city: this.city,
      education: this.education,
      experience: this.experience,
      updateDataFromCV: this.updateDataFromCV,
      skills: this.skills,
    });
  }

  private initializeFormGroupValues(userProfile: IUserProfile): void {
    this.username.setValue(userProfile.username);
    this.email.setValue(userProfile.email);
    this.firstName.setValue(userProfile.firstName);
    this.lastName.setValue(userProfile.lastName);
    this.country.setValue(userProfile.country);
    this.state.setValue(userProfile.state);
    this.city.setValue(userProfile.city);
    this.education.setValue(userProfile.education);
    this.experience.setValue(userProfile.experience);
    this.skills.setValue(userProfile.skills);

    this.editUserProfileFormGroup.patchValue({
      username: userProfile.username,
      email: userProfile.email,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      country: userProfile.country,
      state: userProfile.state,
      city: userProfile.city,
      education: userProfile.education,
      experience: userProfile.experience,
      skills: userProfile.skills,
    });
    this.formData = new FormData();
  }

  onFileChange(event: any): void {
    this.loadingService.show();

    const file = event.target.files[0];

    if (file.type != 'application/pdf') {
      this.errorHandlerService.showMessage(
        'Only PDF files are allowed!',
        'error'
      );
      this.loadingService.hide();
      return;
    }

    this.fileName = file.name;

    if (this.formData.has('UserCVFile')) {
      this.formData.delete('UserCVFile');
    }

    this.formData.append('UserCVFile', file);
    this.loadingService.hide();
  }

  onFileRemove(): void {
    this.loadingService.show();
    this.fileName = '';
    this.formData.delete('UserCV');
    this.loadingService.hide();
  }

  onEditProfile(userProfile: IUserProfile): void {
    this.loadingService.show();

    this.formData.append('FirstName', userProfile.firstName);
    this.formData.append('LastName', userProfile.lastName);
    this.formData.append('Country', userProfile.country);
    this.formData.append('State', userProfile.state);
    this.formData.append('City', userProfile.city);
    this.formData.append('Education', userProfile.education);
    this.formData.append('Experience', userProfile.experience);
    userProfile.skills.forEach((skill) => {
      this.formData.append('Skills', skill);
    });
    this.formData.append('UserCV', this.fileName);

    this.userProfileService
      .editUserProfile(this.formData, this.updateDataFromCV.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        () => {
          this.loadingService.hide();
          window.location.reload();
        },
        (error) => {
          window.location.reload();
        }
      );
  }

  isFormValid(): boolean {
    if (
      this.editUserProfileFormGroup.valid &&
      this.skills.value.length == this.userProfile.skills.length &&
      this.skills.value.every((value: string, index: number) => value === this.userProfile.skills[index]) &&
      this.firstName.value === this.userProfile.firstName &&
      this.lastName.value === this.userProfile.lastName &&
      this.country.value === this.userProfile.country &&
      this.state.value === this.userProfile.state &&
      this.city.value === this.userProfile.city &&
      this.education.value === this.userProfile.education &&
      this.experience.value === this.userProfile.experience &&
      this.initialFileName === this.fileName &&
      this.updateDataFromCV.value === false
    ) {
      return false;
    }
    return true;
  }

  onDownloadCV(): void {
    if (this.userProfile.userCV) {
      window.open(this.userProfile.userCV, '_blank');
    }
  }
}
