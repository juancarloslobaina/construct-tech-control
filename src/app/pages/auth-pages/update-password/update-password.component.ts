import { Component } from '@angular/core';
import { AuthPageLayoutComponent } from '../../../shared/layout/auth-page-layout/auth-page-layout.component';
import { UpdatePasswordFormComponent } from '../../../shared/components/auth/update-password-form/update-password-form.component';

@Component({
  selector: 'app-update-password',
  imports: [
    AuthPageLayoutComponent,
    UpdatePasswordFormComponent,
  ],
  templateUrl: './update-password.component.html',
  styles: ``
})
export class UpdatePasswordComponent {

}
