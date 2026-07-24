import { Component, inject } from '@angular/core';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DropdownItemTwoComponent } from '../../ui/dropdown/dropdown-item/dropdown-item.component-two';
import type { Session } from '@supabase/supabase-js';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  imports:[CommonModule,RouterModule,DropdownComponent,DropdownItemTwoComponent]
})
export class UserDropdownComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly session$ = this.authService.session$;

  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  /** Prefers the first/last name captured at sign-up, falling back to the email. */
  displayName(session: Session | null): string {
    const user = session?.user;
    if (!user) return 'Account';

    const metadata = user.user_metadata as Record<string, unknown>;
    const firstName = typeof metadata['first_name'] === 'string' ? metadata['first_name'] : '';
    const lastName = typeof metadata['last_name'] === 'string' ? metadata['last_name'] : '';
    const fullName = [firstName, lastName].filter(Boolean).join(' ');

    return fullName || user.email || 'Account';
  }

  async logout() {
    this.closeDropdown();
    await this.authService.signOut();
    await this.router.navigateByUrl('/signin');
  }
}
