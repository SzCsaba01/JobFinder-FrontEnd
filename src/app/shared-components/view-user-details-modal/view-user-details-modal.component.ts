import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelfUnsubscriberBase } from '../../utils/SelfUnsubscriberBase';
import { IFilteredUser } from '../../models/user/filteredUser.model';
import { UserService } from '../../services/user.service';
import { takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConfirmationModalComponent } from "../confirmation-modal/confirmation-modal.component";

@Component({
    selector: 'app-view-user-details-modal',
    standalone: true,
    templateUrl: './view-user-details-modal.component.html',
    styleUrl: './view-user-details-modal.component.scss',
    imports: [CommonModule, ConfirmationModalComponent]
})
export class ViewUserDetailsModalComponent extends SelfUnsubscriberBase{
  @Input() user = {} as IFilteredUser;

  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() deleteUserEvent = new EventEmitter<IFilteredUser>();

  confirmationModalMessage = 'Are you sure you want to delete this user?';
  isConfirmationModalShown = false;

  constructor(
    private userService: UserService,
  ) {
    super();
  }

  onDeleteUser(): void {
    this.isConfirmationModalShown = true;
  }

  onCloseModal(): void {
    this.closeModalEvent.emit();
  }

  onConfirmDeleteUser(isConfirmed: boolean): void {
    if (isConfirmed) {
      this.userService.deleteUser(this.user.username)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(() => {
            this.deleteUserEvent.emit(this.user);
          });
    }
    this.isConfirmationModalShown = false;
  }
}
