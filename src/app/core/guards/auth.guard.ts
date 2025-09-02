import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser$;

  if (user()) {
    return true; // Utilisateur connecté
  } else {
    // Rediriger vers la page de connexion
    router.navigate(['/auth/login']);
    return false; // Accès refusé
  }
};
