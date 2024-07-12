import { Component, OnInit } from '@angular/core';
import { SelfUnsubscriberBase } from '../../utils/SelfUnsubscriberBase';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { passwordFormat, usernameFormat } from '../../formats/formats';
import { formModulesUtil } from '../../shared-modules/form-modules.util';
import { UserRegistration } from '../../models/user/userRegistration.model';
import { takeUntil } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { angularMaterialModulesUtil } from '../../shared-modules/angular-material-modules.util';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    formModulesUtil(),
    angularMaterialModulesUtil(),
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent
  extends SelfUnsubscriberBase
  implements OnInit
{
  formData: FormData = {} as FormData;
  fileName: string = '';

  registrationForm: FormGroup = {} as FormGroup;
  username: FormControl = {} as FormControl;
  email: FormControl = {} as FormControl;
  password: FormControl = {} as FormControl;
  repeatPassword: FormControl = {} as FormControl;
  firstName: FormControl = {} as FormControl;
  lastName: FormControl = {} as FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private loadingService: LoadingService,
    private errorHandlerService: ErrorHandlerService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.username = new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(30),
      Validators.pattern(usernameFormat),
    ]);
    this.email = new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(50),
    ]);
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(30),
      Validators.pattern(passwordFormat),
    ]);
    this.repeatPassword = new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(30),
      Validators.pattern(passwordFormat),
    ]);
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

    this.registrationForm = this.formBuilder.group({
      username: this.username,
      email: this.email,
      password: this.password,
      repeatPassword: this.repeatPassword,
      firstName: this.firstName,
      lastName: this.lastName,
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

    if (this.formData.has('UserCV')) {
      this.formData.delete('UserCV');
    }

    this.formData.append('UserCV', file);
    this.loadingService.hide();
  }

  onFileRemove(): void {
    this.loadingService.show();
    this.fileName = '';
    this.formData.delete('UserCV');
    this.loadingService.hide();
  }

  onRegister(userRegistration: UserRegistration): void {
    this.loadingService.show();
    this.formData.append('username', userRegistration.username);
    this.formData.append('email', userRegistration.email);
    this.formData.append('password', userRegistration.password);
    this.formData.append('repeatPassword', userRegistration.repeatPassword);
    this.formData.append('firstName', userRegistration.firstName);
    this.formData.append('lastName', userRegistration.lastName);

    if (this.registrationForm.valid) {
      this.userService
        .register(this.formData)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          () => {
            this.router.navigate(['/login']);
            this.loadingService.hide();
          },
          (error) => {
            this.formData.delete('username');
            this.formData.delete('email');
            this.formData.delete('password');
            this.formData.delete('repeatPassword');
            this.formData.delete('firstName');
            this.formData.delete('lastName');
          }
        );
    }
  }

  onBack(): void {
    this.router.navigate(['']);
  }
}
