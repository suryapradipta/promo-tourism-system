/**
 * Interface definition for the AuthModel, representing the structure of user authentication data.
 * @interface AuthModel
 * @property {string} id - Unique identifier for the user.
 * @property {string} email - User's email address used for authentication.
 * @property {string} password - User's password for authentication.
 * @property {string} role - User's role, indicating their permissions or level of access.
 */
export interface AuthModel {
  id: string;
  email: string;
  password: string;
  role: string;
}
