export interface AuthenticatedUser {
  id: string;
  email: string | null;
  fullName: string | null;
}

export interface AuthPort {
  getCurrentUser(): Promise<AuthenticatedUser | null>;
}
