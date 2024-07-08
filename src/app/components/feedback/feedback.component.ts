import { CommonModule } from '@angular/common';
import { Component, OnInit, Self } from '@angular/core';
import { SelfUnsubscriberBase } from '../../utils/SelfUnsubscriberBase';
import { ActivatedRoute, Router } from '@angular/router';
import { UserFeedbackService } from '../../services/user-feedback.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUserFeedback } from '../../models/feedback/userFeedback.model';
import { angularMaterialModulesUtil } from '../../shared-modules/angular-material-modules.util';
import { formModulesUtil } from '../../shared-modules/form-modules.util';
import { ApplicationStatus } from '../../enums/applicationStatus.enum';
import { LoadingService } from '../../services/loading.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, formModulesUtil(), angularMaterialModulesUtil()],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss',
})
export class FeedbackComponent extends SelfUnsubscriberBase implements OnInit {
  feedback: IUserFeedback = {} as IUserFeedback;

  applicationStatuses = [
    { value: ApplicationStatus.Pending, label: 'Pending' },
    { value: ApplicationStatus.Applied, label: 'Applied' },
    { value: ApplicationStatus.Interviewed, label: 'Interviewed' },
    { value: ApplicationStatus.Hired, label: 'Hired' },
    { value: ApplicationStatus.Rejected, label: 'Rejected' },
    { value: ApplicationStatus['Not Interested'], label: 'Not Interested' },
  ];

  feedbackFormGroup: FormGroup = {} as FormGroup;
  feedbackFormControl: FormControl = {} as FormControl;
  applicationStatusFormControl: FormControl = {} as FormControl;
  companyRatingFormControl: FormControl = {} as FormControl;

  stars: number[] = [1, 2, 3, 4, 5];
  selectedRating: number = 0;
  hoveredRating: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private feedbackService: UserFeedbackService,
    private loadingService: LoadingService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.initializeForm();
    const token = this.activatedRoute.snapshot.paramMap.get('token') as string;
    this.loadingService.show();
    this.feedbackService
      .getFeedbackByToken(token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (feedback) => {
          this.feedback = feedback;
          this.loadingService.hide();
        },
        (error: any) => {
          this.router.navigate(['/home']);
        }
      );
  }

  private initializeForm(): void {
    (this.feedbackFormControl = new FormControl('', [
      Validators.required,
      Validators.maxLength(500),
    ])),
      (this.applicationStatusFormControl = new FormControl('', [
        Validators.required,
      ])),
      (this.companyRatingFormControl = new FormControl('', [
        Validators.required,
      ]));

    this.feedbackFormGroup = new FormGroup({
      feedback: this.feedbackFormControl,
      applicationStatus: this.applicationStatusFormControl,
      companyRating: this.companyRatingFormControl,
    });
  }

  submitFeedback(): void {
    this.loadingService.show();
    if (this.feedbackFormGroup.invalid) {
      return;
    }

    this.feedback.feedback = this.feedbackFormControl.value;
    this.feedback.applicationStatus = this.applicationStatusFormControl.value;
    this.feedback.companyRating = this.companyRatingFormControl.value;

    console.log(this.feedback);
    this.feedbackService
      .updateFeedback(this.feedback)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        () => {
          this.loadingService.hide();
          this.router.navigate(['/home']);
        },
        (error: any) => {
          this.router.navigate(['/home']);
        }
      );
  }

  setRating(rating: number): void {
    this.selectedRating = rating;
    this.companyRatingFormControl.setValue(rating);
  }
}
