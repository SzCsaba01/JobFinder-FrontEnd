import { Component, OnDestroy, OnInit } from '@angular/core';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss'
})
export class ErrorMessageComponent implements OnInit{
  message = '';
  type = {} as 'success' | 'error' as string;
  private subscription = {} as Subscription;
  isVisible = false; 

  constructor(private errorHandlerService: ErrorHandlerService) { }

  ngOnInit() {
    this.subscription = this.errorHandlerService.message$.subscribe(({ message, type }) => {
      if (message) {
        this.message = message; 
        this.type = type;
        this.isVisible = true; 
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  closeMessage() {
    this.message = '';
    this.isVisible = false;
  }
}
