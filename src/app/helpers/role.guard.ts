import { CanActivateFn, ActivatedRouteSnapshot, Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
import { inject } from "@angular/core";

export const RoleGuard : CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authenticationService = inject(AuthenticationService);
    const role = authenticationService.getUserRole();
    const expectedRole = route.data['expectedRoles'];
    const router = inject(Router);
   
    if (!role) {
      return false;
    }

    if (!expectedRole.includes(role)) {
      return router.navigate(['**']);
    }

    return true;
}