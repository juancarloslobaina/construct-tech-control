
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LabelComponent } from '../../form/label/label.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { AlertComponent } from '../../ui/alert/alert.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-update-password-form',
  imports: [
    LabelComponent,
    ButtonComponent,
    InputFieldComponent,
    AlertComponent,
    RouterModule,
    FormsModule
],
  templateUrl: './update-password-form.component.html',
  styles: ``
})
export class UpdatePasswordFormComponent {

  private readonly authService = inject(AuthService);

  showPassword = false;
  password = '';
  confirmPassword = '';

  loading = false;
  errorMessage = '';
  submitted = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (this.loading) return;
    this.errorMessage = '';

    if (!this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in both fields.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.loading = true;
    try {
      await this.authService.updatePassword(this.password);
      this.submitted = true;
    } catch (error) {
      this.errorMessage = error instanceof Error
        ? error.message
        : 'Unable to update your password. The link may have expired — request a new one.';
    } finally {
      this.loading = false;
    }
  }
}
