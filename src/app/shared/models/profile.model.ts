/** Row shape of `public.profiles`, kept in sync with the `handle_new_user` trigger. */
export interface Profile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  updatedAt: string | null;
}
