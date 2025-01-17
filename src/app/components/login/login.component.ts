import { Component, OnInit } from '@angular/core';
import { formModulesUtil } from '../../shared-modules/form-modules.util';
import { SelfUnsubscriberBase } from '../../utils/SelfUnsubscriberBase';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { takeUntil } from 'rxjs';
import { AuthenticationRequest } from '../../models/authentication/authenticationRequest.model';
import { CommonModule } from '@angular/common';
import { angularMaterialModulesUtil } from '../../shared-modules/angular-material-modules.util';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    formModulesUtil(),
    angularMaterialModulesUtil(),
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent extends SelfUnsubscriberBase implements OnInit {
  loginForm: FormGroup = {} as FormGroup;
  userCredential: FormControl = {} as FormControl;
  password: FormControl = {} as FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private loadingService: LoadingService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.userCredential = new FormControl('', [Validators.required]);
    this.password = new FormControl('', [Validators.required]);

    this.loginForm = this.formBuilder.group({
      userCredential: this.userCredential,
      password: this.password,
    });
  }

  onLogin(authenticationRequest: AuthenticationRequest): void {
    this.loadingService.show();
    this.authenticationService
      .login(authenticationRequest)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        this.loadingService.hide();
        if (response) {
          this.router.navigate(['/home']);
        }
      });
  }

  onBack(): void {
    this.router.navigate(['']);
  }
}
