import { Component, OnInit } from '@angular/core';
import { SelfUnsubscriberBase } from '../../utils/SelfUnsubscriberBase';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { passwordFormat } from '../../formats/formats';
import { takeUntil } from 'rxjs';
import { UserChangePassword } from '../../models/user/userChangePassword.model';
import { formModulesUtil } from '../../shared-modules/form-modules.util';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, RouterModule, formModulesUtil()],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent extends SelfUnsubscriberBase implements OnInit{

  private token = this.activatedRoute.snapshot.paramMap.get("token") as string;

  changePasswordForm: FormGroup = {} as FormGroup;
  newPassword: FormControl = {} as FormControl;
  repeatNewPassword: FormControl = {} as FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('test');
    this.initializeForm();
    this.userService.verifyIfResetPasswordTokenExists(this.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (!result) {
          this.route.navigate(['/page_not_found']);
        }
      });
  }

  changePassword(userChangePassword: UserChangePassword): void {
    userChangePassword.resetPasswordToken = this.token;

    this.userService.changePassword(userChangePassword)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.route.navigate(['/login']);
      });
  }

  private initializeForm(): void {
    this.newPassword = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern(passwordFormat)]);
    this.repeatNewPassword = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern(passwordFormat)]);

    this.changePasswordForm = this.formBuilder.group({
      newPassword: this.newPassword,
      repeatNewPassword: this.repeatNewPassword
    });
  }

  onBackButtonClicked(): void {
    this.route.navigate(['']);
  }
}
