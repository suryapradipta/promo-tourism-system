export interface AuthModel {
  id: string;
  email: string;
  password?: string;
  role: string;
  isFirstLogin: boolean;
}
