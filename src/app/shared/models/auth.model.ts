/**
 * Defines the structure of user authentication data.
 *
 * @interface AuthModel
 * @property {string} id - User identifier.
 * @property {string} email - User's email address.
 * @property {string} password - User's password.
 * @property {string} role - User's role or access level.
 * @property {boolean} isFirstLogin - Indicates whether it is the user's first login.
 */
export interface AuthModel {
  id: string;
  email: string;
  password?: string;
  role: string;
  isFirstLogin: boolean;
}
