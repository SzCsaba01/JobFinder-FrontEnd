import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SelfUnsubscriberBase } from '../../utils/SelfUnsubscriberBase';
import { UserService } from '../../services/user.service';
import { IFilteredUserSearch } from '../../models/user/filteredUsersSearch.model';
import { takeUntil } from 'rxjs';
import { IFilteredUsersPagination } from '../../models/user/filteredUsersPagination.model';
import { angularMaterialModulesUtil } from '../../shared-modules/angular-material-modules.util';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { IFilteredUser } from '../../models/user/filteredUser.model';
import { ViewUserDetailsModalComponent } from '../../shared-components/view-user-details-modal/view-user-details-modal.component';
import { FormControl, FormGroup } from '@angular/forms';
import { ICountryStateCity } from '../../models/location/countryStateCity.model';
import { CountryStateCityService } from '../../services/country-state-city.service';
import { formModulesUtil } from '../../shared-modules/form-modules.util';
import { LoadingService } from '../../services/loading.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss',
  imports: [
    CommonModule,
    NgSelectModule,
    formModulesUtil(),
    angularMaterialModulesUtil(),
    ViewUserDetailsModalComponent,
  ],
})
export class ManageUsersComponent
  extends SelfUnsubscriberBase
  implements OnInit
{
  selectedUser = {} as IFilteredUser;
  isViewUserDetailsModalShown = false;

  displayedColumns: string[] = [
    'username',
    'education',
    'experience',
    'skills',
    'country',
    'state',
    'city',
  ];
  
  numberOfUsers = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  dataSource = new MatTableDataSource<IFilteredUser>();

  filteredUserSearch = {} as IFilteredUserSearch;

  countryStateCity = {} as ICountryStateCity;

  filtersFormGroup = {} as FormGroup;

  username = {} as FormControl;
  education = {} as FormControl;
  experience = {} as FormControl;
  country = {} as FormControl;
  state = {} as FormControl;
  city = {} as FormControl;

  constructor(
    private userService: UserService,
    private countryStateCityService: CountryStateCityService,
    private loadingService: LoadingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadingService.show();
    this.filteredUserSearch.page = 0;
    this.filteredUserSearch.pageSize = 5;
    this.initializeForm();
    this.loadData();
  }

  private initializeForm(): void {
    this.username = new FormControl('');
    this.education = new FormControl('');
    this.experience = new FormControl('');
    this.country = new FormControl('');
    this.state = new FormControl({ value: '', disabled: true });
    this.city = new FormControl({ value: '', disabled: true });

    this.filtersFormGroup = new FormGroup({
      username: this.username,
      education: this.education,
      experience: this.experience,
      country: this.country,
      state: this.state,
      city: this.city,
    });

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
        this.dataSource._updateChangeSubscription();
        this.city.enable();
      }
    });
  }

  private loadData(): void {
    this.userService
      .getFilteredUsersPaginated(this.filteredUserSearch)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: IFilteredUsersPagination) => {
        this.numberOfUsers = result.numberOfUsers;
        this.dataSource.data = result.users;
        this.dataSource.data.forEach((user) => {
          const state = this.countryStateCityService.getStateNameByIsoCodeAndCountry(user.state, user.country);
          if (state) {
            user.state = state;
          }
          const country = this.countryStateCityService.getCountryByIsoCode(
            user.country
          );
          if (country) {
            user.country = country?.name;
          }
        });
        this.loadingService.hide();
      });
  }

  applyFilters(): void {
    this.loadingService.show();
    const filters = this.filtersFormGroup.value as IFilteredUserSearch;
    this.filteredUserSearch = filters;
    this.filteredUserSearch.page = 0;
    this.filteredUserSearch.pageSize = 5;
    this.loadData();
  }

  onPageChange(event: any): void {
    this.filteredUserSearch.page = event.pageIndex;
    this.filteredUserSearch.pageSize = event.pageSize;
    this.loadData();
  }

  onRowClicked(user: IFilteredUser) {
    this.selectedUser = user;
    this.isViewUserDetailsModalShown = true;
  }

  onCloseModal(): void {
    this.isViewUserDetailsModalShown = false;
  }

  onDeleteUser(user: IFilteredUser): void {
    this.dataSource.data = this.dataSource.data.filter(
      (u) => u.username !== user.username
    );
    this.isViewUserDetailsModalShown = false;
  }
}
