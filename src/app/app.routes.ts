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

export const routes: Routes = [
    {
        path: 'home',
        component: HomeLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'profile',
                component: UserProfileComponent
            },
            {
                path: 'manage-users',
                component: ManageUsersComponent,
                canActivate: [RoleGuard],
                data: {
                    expectedRoles: 'Admin'
                }
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