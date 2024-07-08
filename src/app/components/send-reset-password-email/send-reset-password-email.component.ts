import { Component, OnInit } from '@angular/core';
import { SelfUnsubscriberBase } from '../../utils/SelfUnsubscriberBase';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { takeUntil } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { formModulesUtil } from '../../shared-modules/form-modules.util';
import { CommonModule } from '@angular/common';
import { angularMaterialModulesUtil } from '../../shared-modules/angular-material-modules.util';

@Component({
  selector: 'app-send-reset-password-email',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    formModulesUtil(),
    angularMaterialModulesUtil(),
  ],
  templateUrl: './send-reset-password-email.component.html',
  styleUrl: './send-reset-password-email.component.scss',
})
export class SendResetPasswordEmailComponent
  extends SelfUnsubscriberBase
  implements OnInit
{
  emailFormGroup: FormGroup = {} as FormGroup;
  email = {} as FormControl;

  constructor(private userService: UserService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.email = new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(50),
    ]);
    this.emailFormGroup = new FormGroup({
      email: this.email,
    });
  }

  sendResetPasswordEmail(email: string): void {
    this.userService
      .sendResetPasswordEmail(email)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.router.navigate(['/login']);
      });
  }

  onBackButtonClicked(): void {
    this.router.navigate(['/login']);
  }
}
