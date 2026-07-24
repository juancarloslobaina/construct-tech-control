// Development environment.
// The Supabase publishable key is safe to expose client-side by design — access is enforced
// by Row Level Security (RLS) policies on the database, never by keeping this key secret.
// Never put the `service_role` key here or in any file that ships to the browser.
export const environment = {
  production: false,
  supabaseUrl: 'https://jgxrlncdgfgpbcgqgtnc.supabase.co',
  supabaseAnonKey: 'sb_publishable_XPMWbVtv29LaBfihwYLu4w_1iNKSNp1',
};
