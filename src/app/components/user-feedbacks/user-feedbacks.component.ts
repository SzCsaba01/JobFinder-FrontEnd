import { Component, OnInit } from '@angular/core';
import { SelfUnsubscriberBase } from '../../utils/SelfUnsubscriberBase';

@Component({
  selector: 'app-user-feedbacks',
  standalone: true,
  imports: [],
  templateUrl: './user-feedbacks.component.html',
  styleUrl: './user-feedbacks.component.scss'
})
export class UserFeedbacksComponent extends SelfUnsubscriberBase implements OnInit{
  constructor() {
    super();
  }
  
  ngOnInit(): void {
    
  }

}
