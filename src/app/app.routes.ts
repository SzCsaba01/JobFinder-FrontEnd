import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { SendResetPasswordEmailComponent } from './components/send-reset-password-email/send-reset-password-email.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { AuthGuard } from './helpers/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { RoleGuard } from './helpers/role.guard';
import { LandingPageLayoutComponent } from './layouts/landing-page-layout/landing-page-layout.component';
import { AddJobComponent } from './components/add-job/add-job.component';
import { JobApplicationsComponent } from './components/job-applications/job-applications.component';
import { SavedJobsComponent } from './components/saved-jobs/saved-jobs.component';
import { FeaturedComponent } from './components/featured/featured.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { UserFeedbacksComponent } from './components/user-feedbacks/user-feedbacks.component';
import { JobRecommendationsComponent } from './components/job-recommendations/job-recommendations.component';

export const routes: Routes = [
    {
        path: 'home',
        component: HomeLayoutComponent,
        children: [
            {
                path: '',
                component: HomeComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'profile',
                component: UserProfileComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'manage-users',
                component: ManageUsersComponent,
                canActivate: [RoleGuard],
                data: {
                    expectedRoles: 'Admin'
                }
            },
            {
                path: 'add-job',
                component: AddJobComponent,
                canActivate: [RoleGuard],
                data: {
                    expectedRoles: 'Admin'
                }
            },
            {
                path: 'saved-jobs',
                component: SavedJobsComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'job-applications',
                component: JobApplicationsComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'featured',
                component: FeaturedComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'user-feedbacks',
                component: UserFeedbacksComponent,
                canActivate: [RoleGuard],
                data: {
                    expectedRoles: 'Admin'
                }
            },
            {
                path: 'feedback/:token',
                component: FeedbackComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'job-recommendations',
                component: JobRecommendationsComponent,
                canActivate: [AuthGuard],
            }
        ]
    },
    {
        path: '',
        component: LandingPageLayoutComponent,
        children: [
            {
                path: 'login',
                component: LoginComponent,
            },
            {
                path: 'registration',
                component: RegistrationComponent,
            },
            {
                path: 'send-reset-password-email',
                component: SendResetPasswordEmailComponent,
            },
            {
                path:'',
                component: LandingPageComponent,
                pathMatch: 'full'
            },
            {
                path: 'change-password/:token',
                component: ChangePasswordComponent,
            },
            {
                path: 'verify-email/:token',
                component: VerifyEmailComponent,
            },
            {
                path: '**',
                redirectTo: '',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'page-not-found',
        component: PageNotFoundComponent,
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];