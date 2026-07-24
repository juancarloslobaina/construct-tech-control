import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthPageLayoutComponent } from '../../../shared/layout/auth-page-layout/auth-page-layout.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { AuthService } from '../../../shared/services/auth.service';

/**
 * Landing spot for Supabase email-confirmation links and the Google OAuth redirect.
 * `detectSessionInUrl` (set on the client) already parses implicit-flow tokens from the URL
 * hash automatically; here we only need to handle the PKCE `?code=...` case explicitly and
 * then send the user on to the dashboard (or back to sign-in if the link was bad/expired).
 */
@Component({
  selector: 'app-auth-callback',
  imports: [
    AuthPageLayoutComponent,
    AlertComponent,
    RouterModule,
  ],
  templateUrl: './auth-callback.component.html',
  styles: ``
})
export class AuthCallbackComponent implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  errorMessage = '';

  async ngOnInit() {
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has('code')) {
        await this.authService.exchangeCodeForSession(window.location.href);
      }

      await this.authService.ready;

      if (this.authService.isAuthenticated) {
        await this.router.navigateByUrl('/');
      } else {
        this.errorMessage = 'We could not complete sign-in. The link may have expired — please try again.';
      }
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'We could not complete sign-in. Please try again.';
    }
  }
}
