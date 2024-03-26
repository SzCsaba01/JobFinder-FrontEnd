import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { SelfUnsubscriberBase } from '../../utils/SelfUnsubscriberBase';
import { takeUntil } from 'rxjs';
import { userRoles } from '../../constants/user-roles';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss'
})
export class NavigationBarComponent extends SelfUnsubscriberBase implements OnInit{

  constructor(private authenticationService: AuthenticationService)
  {
    super();
  }

  userRole: string | unknown;
  userRoles = userRoles;

  ngOnInit(): void {
    this.userRole = this.authenticationService.getUserRole();
  }

  onSignOut(): void {
    this.authenticationService.logout()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }
}
