import { Component, OnInit } from '@angular/core';
import { SelfUnsubscriberBase } from '../../utils/SelfUnsubscriberBase';
import { UserProfileService } from '../../services/user-profile.service';
import { takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { formModulesUtil } from '../../shared-modules/form-modules.util';
import { IUserProfile } from '../../models/profile/user.profile.model';
import { CountryStateCityService } from '../../services/country-state-city.service';
import { ICountryStateCity } from '../../models/location/countryStateCity.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, formModulesUtil()],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent extends SelfUnsubscriberBase implements OnInit {

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
  // skills = {} as FormControl;

  private userProfile = {} as IUserProfile;

  countryStateCity = {} as ICountryStateCity;
    
  constructor(
    private formBuilder: FormBuilder,
    private userProfileService: UserProfileService,
    private countryStateCityService: CountryStateCityService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initializeForm();

    this.userProfileService.getUserProfile()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userProfile) => {
        this.userProfile = userProfile;
        this.initializeFormGroupValues(userProfile);
      });

    this.countryStateCity.country = this.countryStateCityService.getCountries();

    this.country.valueChanges.subscribe((country) => {
      this.state.reset();
      this.state.disable();
      if (country) {
        this.countryStateCity.state = this.countryStateCityService.getStatesByCountry(country);
        this.countryStateCity.countryCode = country;
        this.state.enable();
      }
    });

    this.state.valueChanges.subscribe((state) => {
      this.city.reset();
      this.city.disable();
      if (state) {
        this.countryStateCity.city = this.countryStateCityService.getCitiesByState(this.country.value, state);
        this.city.enable();
      }
    });
  }

  private initializeForm(): void {
    this.username = new FormControl({ value: '', disabled: true });
    this.email = new FormControl({ value: '', disabled: true });
    this.firstName = new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]);
    this.lastName = new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]);
    this.country = new FormControl('');
    this.state = new FormControl({ value: '', disabled: true }, );
    this.city = new FormControl({ value: '', disabled: true });
    this.education = new FormControl('', [Validators.minLength(2), Validators.maxLength(200)]);
    this.experience = new FormControl('', [Validators.minLength(2), Validators.maxLength(200)]);
    // this.skills = new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]);

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
      // skills: this.skills
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
    // this.skills.setValue(userProfile.skills);

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
      // skills: userProfile.skills
    });
  }

  onEdit(userProfile: IUserProfile): void {
    this.userProfileService.editUserProfile(userProfile)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  isFormValid(): boolean {
    if (this.editUserProfileFormGroup.valid &&
      this.firstName.value === this.userProfile.firstName &&
      this.lastName.value === this.userProfile.lastName &&
      this.country.value === this.userProfile.country &&
      this.state.value === this.userProfile.state &&
      this.city.value === this.userProfile.city &&
      this.education.value === this.userProfile.education &&
      this.experience.value === this.userProfile.experience) {
      return true;
    }

    return false;
  }

  onBack(): void {

  }

}
