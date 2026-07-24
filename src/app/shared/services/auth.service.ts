import { Injectable, inject } from '@angular/core';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, map } from 'rxjs';
import type { AppRole } from '../models/role.model';
import { SupabaseService } from './supabase.service';

export interface SignUpMetadata {
  firstName: string;
  lastName: string;
}

/**
 * Wraps supabase.auth for the rest of the app. Mirrors the BehaviorSubject pattern used by
 * ThemeService: components read `session$`/`currentUser` instead of touching Supabase directly.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService).client;

  private readonly sessionSubject = new BehaviorSubject<Session | null>(null);
  readonly session$: Observable<Session | null> = this.sessionSubject.asObservable();

  /** Backed by `public.user_roles`; `null` while signed out or before the row has loaded. */
  private readonly roleSubject = new BehaviorSubject<AppRole | null>(null);
  readonly role$: Observable<AppRole | null> = this.roleSubject.asObservable();
  readonly isAdmin$: Observable<boolean> = this.role$.pipe(map((role) => role === 'ADMIN'));

  /**
   * Resolves once the session (and its role) has been read from storage at least once. Guards
   * must await this before checking `isAuthenticated`/`isAdmin`, otherwise a page refresh
   * briefly reports "logged out" and redirects before the persisted session has a chance to load.
   */
  readonly ready: Promise<void>;

  constructor() {
    this.ready = this.supabase.auth.getSession().then(async ({ data }) => {
      this.sessionSubject.next(data.session);
      await this.loadRole(data.session?.user.id ?? null);
    });

    this.supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      this.sessionSubject.next(session);
      void this.loadRole(session?.user.id ?? null);
    });
  }

  get currentSession(): Session | null {
    return this.sessionSubject.value;
  }

  get currentUser(): User | null {
    return this.sessionSubject.value?.user ?? null;
  }

  get isAuthenticated(): boolean {
    return this.currentSession !== null;
  }

  get currentRole(): AppRole | null {
    return this.roleSubject.value;
  }

  get isAdmin(): boolean {
    return this.currentRole === 'ADMIN';
  }

  /**
   * Reads the caller's own role from `public.user_roles` — RLS only exposes that one row, so
   * there's nothing to filter beyond `user_id`. Resolves to `null` (treated as "not an admin")
   * when signed out, the row is missing, or the query fails.
   */
  private async loadRole(userId: string | undefined | null): Promise<void> {
    if (!userId) {
      this.roleSubject.next(null);
      return;
    }

    const { data, error } = await this.supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    this.roleSubject.next(error ? null : ((data?.role as AppRole | undefined) ?? null));
  }

  async signIn(email: string, password: string): Promise<void> {
    const { error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async signUp(email: string, password: string, metadata: SignUpMetadata): Promise<void> {
    const { error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: metadata.firstName,
          last_name: metadata.lastName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  }

  async signInWithGoogle(): Promise<void> {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  }

  async resetPasswordForEmail(email: string): Promise<void> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    if (error) throw error;
  }

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await this.supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  /** Completes a PKCE OAuth/email-link callback (`?code=...`). No-op call site is safe to skip when there's no `code`. */
  async exchangeCodeForSession(url: string): Promise<void> {
    const { error } = await this.supabase.auth.exchangeCodeForSession(url);
    if (error) throw error;
  }
}
