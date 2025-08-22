export interface User {
  id?: number;
  token?: string;
  username?: string | null;
  email?: string | null;
  plainPassword?: string;
  roles?: string[] | null;
  enabled?: boolean | null;
  familyName?: string | null;
  givenName?: string | null;
  lastLogin?: string | null;
}
