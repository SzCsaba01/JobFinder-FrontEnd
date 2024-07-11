import { Component, OnInit } from '@angular/core';
import { SelfUnsubscriberBase } from '../../utils/SelfUnsubscriberBase';
import { CompanyService } from '../../services/company.service';
import { CategoryService } from '../../services/category.service';
import { ICompany } from '../../models/company/company.model';
import { ICategory } from '../../models/category/category.model';
import { LoadingService } from '../../services/loading.service';
import { Observable, forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { angularMaterialModulesUtil } from '../../shared-modules/angular-material-modules.util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-featured',
  standalone: true,
  imports: [CommonModule, angularMaterialModulesUtil()],
  templateUrl: './featured.component.html',
  styleUrl: './featured.component.scss',
})
export class FeaturedComponent extends SelfUnsubscriberBase implements OnInit {
  topAppliedCompanies: ICompany[] = [];
  topSavedCompanies: ICompany[] = [];
  topAppliedCategories: ICategory[] = [];
  topSavedCategories: ICategory[] = [];

  constructor(
    private companyService: CompanyService,
    private categoryService: CategoryService,
    private loadingService: LoadingService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadingService.show();

    const requests: Observable<any>[] = [];

    requests.push(this.companyService.getMostVisitedCompaniesInLast30Days());
    requests.push(this.companyService.getMostSavedCompaniesInLast30Days());
    requests.push(this.categoryService.getMostVisitedCategoriesInLast30Days());
    requests.push(this.categoryService.getMostSavedCategoriesInLast30Days());

    forkJoin(requests).subscribe((response) => {
      this.topAppliedCompanies = response[0];
      this.topSavedCompanies = response[1];
      this.topAppliedCategories = response[2];
      this.topSavedCategories = response[3];
      this.loadingService.hide();
    });
  }

  onCategoryClick(category: ICategory): void {
    sessionStorage.setItem('category', category.name);
    this.router.navigate(['/home']);
  }

  onCompanyClick(company: ICompany): void {
    sessionStorage.setItem('company', company.name);
    this.router.navigate(['/home']);
  }
}
