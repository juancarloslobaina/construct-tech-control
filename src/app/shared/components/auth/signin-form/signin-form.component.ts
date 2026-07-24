
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { AlertComponent } from '../../ui/alert/alert.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signin-form',
  imports: [
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    InputFieldComponent,
    AlertComponent,
    RouterModule,
    FormsModule
],
  templateUrl: './signin-form.component.html',
  styles: ``
})
export class SigninFormComponent {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  showPassword = false;
  isChecked = false;

  email = '';
  password = '';

  loading = false;
  errorMessage = '';

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onSignIn() {
    if (this.loading) return;
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }

    this.loading = true;
    try {
      await this.authService.signIn(this.email, this.password);
      await this.router.navigateByUrl('/');
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Unable to sign in. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  async onGoogleSignIn() {
    this.errorMessage = '';
    try {
      await this.authService.signInWithGoogle();
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Unable to sign in with Google.';
    }
  }
}
