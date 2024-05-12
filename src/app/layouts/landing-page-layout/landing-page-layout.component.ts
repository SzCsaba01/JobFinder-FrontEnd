import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-landing-page-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './landing-page-layout.component.html',
  styleUrl: './landing-page-layout.component.scss',
})
export class LandingPageLayoutComponent implements OnInit {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authenticationService.isAuthenticated()) {
      this.router.navigate(['home']);
    }
  }
}
