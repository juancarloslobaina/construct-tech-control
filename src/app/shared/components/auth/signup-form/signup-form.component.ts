
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
  selector: 'app-signup-form',
  imports: [
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    InputFieldComponent,
    AlertComponent,
    RouterModule,
    FormsModule
],
  templateUrl: './signup-form.component.html',
  styles: ``
})
export class SignupFormComponent {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  showPassword = false;
  isChecked = false;

  fname = '';
  lname = '';
  email = '';
  password = '';

  loading = false;
  errorMessage = '';

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onSignUp() {
    if (this.loading) return;
    this.errorMessage = '';

    if (!this.fname || !this.lname || !this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }
    if (!this.isChecked) {
      this.errorMessage = 'Please accept the Terms and Conditions to continue.';
      return;
    }

    this.loading = true;
    try {
      await this.authService.signUp(this.email, this.password, {
        firstName: this.fname,
        lastName: this.lname,
      });
      await this.router.navigateByUrl('/check-email');
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Unable to create your account. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  async onGoogleSignUp() {
    this.errorMessage = '';
    try {
      await this.authService.signInWithGoogle();
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Unable to sign up with Google.';
    }
  }
}
