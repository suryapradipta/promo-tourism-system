/**
 * Defines the structure of the authentication model representing a user.
 *
 * @interface Auth
 * @property {string} _id - Unique identifier for the user.
 * @property {string} email - User's email address.
 * @property {string | undefined} password - User's password (optional for security reasons).
 * @property {string} role - User's role (e.g., 'ministry', 'merchant', 'customer').
 * @property {boolean} isFirstLogin - Flag indicating if the user is logging in for the first time.
 * @property {string | undefined} createdAt - Timestamp indicating when the user account was created (optional).
 * @property {string | undefined} updatedAt - Timestamp indicating when the user account was last updated (optional).
 */
export interface Auth {
  _id: string;
  email: string;
  password?: string;
  role: string;
  isFirstLogin: boolean;
  createdAt?: string;
  updatedAt?: string;
}
