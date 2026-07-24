
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LabelComponent } from '../../form/label/label.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { AlertComponent } from '../../ui/alert/alert.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reset-password-form',
  imports: [
    LabelComponent,
    ButtonComponent,
    InputFieldComponent,
    AlertComponent,
    RouterModule,
    FormsModule
],
  templateUrl: './reset-password-form.component.html',
  styles: ``
})
export class ResetPasswordFormComponent {

  private readonly authService = inject(AuthService);

  email = '';
  loading = false;
  errorMessage = '';
  submitted = false;

  async onSubmit() {
    if (this.loading) return;
    this.errorMessage = '';

    if (!this.email) {
      this.errorMessage = 'Please enter your email address.';
      return;
    }

    this.loading = true;
    try {
      await this.authService.resetPasswordForEmail(this.email);
      this.submitted = true;
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Unable to send the reset link. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}
