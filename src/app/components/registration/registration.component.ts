import { Component, OnInit } from '@angular/core';
import { SelfUnsubscriberBase } from '../../utils/SelfUnsubscriberBase';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { passwordFormat, usernameFormat } from '../../formats/formats';
import { formModulesUtil } from '../../shared-modules/form-modules.util';
import { UserRegistration } from '../../models/user/userRegistration.model';
import { takeUntil } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { angularMaterialModulesUtil } from '../../shared-modules/angular-material-modules.util';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, RouterModule, formModulesUtil(), angularMaterialModulesUtil()],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent extends SelfUnsubscriberBase implements OnInit{

  registrationForm : FormGroup = {} as FormGroup;
  username : FormControl = {} as FormControl;
  email : FormControl = {} as FormControl;
  password : FormControl = {} as FormControl;
  repeatPassword : FormControl = {} as FormControl;
  firstName : FormControl = {} as FormControl;
  lastName : FormControl = {} as FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.username = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern(usernameFormat)]);
    this.email = new FormControl('', [Validators.required, Validators.email, Validators.maxLength(50)]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern(passwordFormat)]);
    this.repeatPassword = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern(passwordFormat)]);
    this.firstName = new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]);
    this.lastName = new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]);

    this.registrationForm = this.formBuilder.group({
      username: this.username,
      email: this.email,
      password: this.password,
      repeatPassword: this.repeatPassword,
      firstName: this.firstName,
      lastName: this.lastName
    });
  }

  onRegister(userRegistration: UserRegistration): void {
    if (this.registrationForm.valid) {
      this.userService.register(userRegistration)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
            this.router.navigate(['/login']);
          }
        );
    }
  }

  onBack(): void {
    this.router.navigate(['']);
  }
}
