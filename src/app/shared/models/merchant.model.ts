/**
 * Interface definition for the MerchantModel, representing the structure of merchant information.
 * @interface MerchantModel
 * @property {string} id - Unique identifier for the merchant.
 * @property {string} name - Name of the merchant.
 * @property {number} contact_number - Contact number of the merchant.
 * @property {string} email - Email address associated with the merchant.
 * @property {string} description - Description or additional information about the merchant.
 * @property {any} documents - Merchant's documents, in any format.
 * @property {string} document_description - Description or details about the merchant's documents.
 * @property {string} status - Current status of the merchant (e.g., PENDING, APPROVE, REJECT).
 */
export interface MerchantModel {
  id: string;
  name: string;
  contact_number: number;
  email: string;
  description: string;
  documents: any;
  document_description: string;
  status: string;
}
