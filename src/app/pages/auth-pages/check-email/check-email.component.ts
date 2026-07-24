import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthPageLayoutComponent } from '../../../shared/layout/auth-page-layout/auth-page-layout.component';

@Component({
  selector: 'app-check-email',
  imports: [
    AuthPageLayoutComponent,
    RouterModule,
  ],
  templateUrl: './check-email.component.html',
  styles: ``
})
export class CheckEmailComponent {

}
