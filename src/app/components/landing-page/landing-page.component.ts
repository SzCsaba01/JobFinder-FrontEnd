import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  features = [
    { icon: 'path/to/icon1.png', title: 'Upload Your CV', description: 'Easily upload your CV and start getting matched.' },
    { icon: 'path/to/icon2.png', title: 'Get Personalized Recommendations', description: 'Receive job recommendations that fit your profile.' },
  ];

  testimonials = [
    { quote: 'This platform helped me find my dream job effortlessly.', user: 'Jane Doe' },
    { quote: 'The AI matching is incredibly accurate. Highly recommend.', user: 'John Smith' },
  ];

  constructor() { }
}