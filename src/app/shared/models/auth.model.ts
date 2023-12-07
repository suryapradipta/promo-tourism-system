export interface AuthModel {
  _id: string;
  email: string;
  password?: string;
  role: string;
  isFirstLogin: boolean;
  createdAt?: string;
  updatedAt?: string;
}
