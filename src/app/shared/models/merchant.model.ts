/**
 * Represents the structure of a merchant entity with specific properties.
 *
 * @interface MerchantModel
 * @property {string} id - Unique identifier for the merchant.
 * @property {string} name - Name of the merchant.
 * @property {number} contact_number - Contact number of the merchant.
 * @property {string} email - Email address of the merchant.
 * @property {string} description - Description or information about the merchant.
 * @property {any} documents - Any documents associated with the merchant.
 * @property {string} document_description - Description of the documents associated with the merchant.
 * @property {string} status - Current status of the merchant.
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
