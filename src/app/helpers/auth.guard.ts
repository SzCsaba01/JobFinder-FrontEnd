import { CanActivateFn, Router} from "@angular/router";

import { AuthenticationService } from "../services/authentication.service";
import { inject } from "@angular/core";

export const AuthGuard : CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService)
  const router = inject(Router);
  
  if (authenticationService.isAuthenticated()) {
    return true;
  }

  return router.navigate(['**']);
}