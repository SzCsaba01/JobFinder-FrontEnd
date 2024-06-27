import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  features = [
    {
      title: 'Upload Your CV',
      description: 'Easily upload your CV and start getting matched.',
      icon: 'assets/upload.svg',
    },
    {
      title: 'Get Personalized Recommendations',
      description: 'Receive job recommendations that fit your profile.',
      icon: 'assets/recommendations.svg',
    },
    {
      title: 'View Latest Trends',
      description:
        'Stay updated with the latest trends about companies and categories.',
      icon: 'assets/trends.svg',
    },
  ];

  partners = [
    {
      name: 'Adzuna',
      logo: 'assets/adzuna-logo.png',
    },
    {
      name: 'Jobicy',
      logo: 'assets/jobicy-logo.png',
    },
    {
      name: 'Remotive',
      logo: 'assets/remotive-logo.png',
    }
  ];
}
