import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Protects the dashboard: no session -> redirect to /signin. */
export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.ready;

  return auth.isAuthenticated ? true : router.parseUrl('/signin');
};

/** Keeps logged-in users out of /signin and /signup, sending them to the dashboard instead. */
export const publicOnlyGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.ready;

  return auth.isAuthenticated ? router.parseUrl('/') : true;
};
