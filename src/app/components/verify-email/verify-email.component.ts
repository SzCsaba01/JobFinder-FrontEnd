import { Component, OnInit } from '@angular/core';
import { SelfUnsubscriberBase } from '../../utils/SelfUnsubscriberBase';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent extends SelfUnsubscriberBase implements OnInit{

  private token = this.activatedRoute.snapshot.paramMap.get("token") as string;

  constructor(
    private route: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.userService.verifyEmailByRegistrationToken(this.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.route.navigate(['/login']);
        },
        error: () => {
          this.route.navigate(['/page_not_found']);
        }
      });
  }
}
