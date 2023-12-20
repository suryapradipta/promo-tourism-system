/**
 * Defines the structure of the merchant model, representing information about a business entity.
 *
 * @interface Merchant
 * @property {string} _id - Unique identifier for the merchant.
 * @property {string} name - Name of the merchant.
 * @property {number} contact_number - Contact number for the merchant.
 * @property {string} email - Email address associated with the merchant.
 * @property {string} company_description - Description of the merchant's business.
 * @property {any} documents - Documents related to the merchant (type 'any' for flexibility).
 * @property {string} document_description - Description of the documents associated with the merchant.
 * @property {string} status - Status of the merchant (e.g., 'APPROVED', 'REJECTED', 'PENDING').
 * @property {string | undefined} createdAt - Timestamp indicating when the merchant record was created (optional).
 * @property {string | undefined} updatedAt - Timestamp indicating when the merchant record was last updated (optional).
 */
export interface Merchant {
  _id: string;
  name: string;
  contact_number: number;
  email: string;
  company_description: string;
  documents: any;
  document_description: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}
