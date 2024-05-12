import { inject } from '@angular/core';
import { HttpRequest, HttpErrorResponse, HttpInterceptorFn, HttpHandlerFn, HttpStatusCode, HttpResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ErrorHandlerService } from '../services/error-handler.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { LoadingService } from '../services/loading.service';

export const ErrorInterceptor : HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) : Observable<HttpEvent<any>> => {
    const errorHandlerService = inject(ErrorHandlerService);
    const authenticationService = inject(AuthenticationService);
    const loadingService = inject(LoadingService);
    const router = inject(Router);
    return next(req).pipe(
        tap((event: any) => {
            if (event.status == HttpStatusCode.Ok && event.body && event.body.message) {
                errorHandlerService.showMessage(event.body.message, 'success');
            } 
        }),
        catchError((error: HttpErrorResponse) => {
            let errorMessage = {} as {message: string};
            loadingService.hide();
            if (error.status == HttpStatusCode.Unauthorized) {
                authenticationService.logout();
                router.navigate(['']);
            } else {
                errorMessage.message = error.error.message || error.statusText;
                errorHandlerService.showMessage(errorMessage.message, 'error');
            }
            return throwError(() => error);
        })
    )
}