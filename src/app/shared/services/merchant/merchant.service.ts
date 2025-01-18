/**
 * This service handles interactions with the server's merchant-related API endpoints,
 * including registration, document uploads, application status retrieval, and email sending.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Merchant } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class MerchantService {
  private apiUrl = `${environment.apiUrl}/merchants`;

  /**
   * @constructor
   * @param {HttpClient} http - Angular's HTTP client for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Get merchant ID by email.
   *
   * @param {string} email - The email address of the merchant.
   * @returns {Observable<any>} - Observable containing the merchant ID.
   */
  getMerchantIdByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/by-email/${email}`);
  }

  /**
   * Register a new merchant.
   *
   * @param {string} name - The name of the merchant.
   * @param {number} contact_number - The contact number of the merchant.
   * @param {string} email - The email address of the merchant.
   * @param {string} company_description - Description of the merchant's company.
   * @returns {Observable<any>} - Observable containing the registration response.
   */
  registerMerchant(
    name: string,
    contact_number: number,
    email: string,
    company_description: string
  ): Observable<any> {
    const merchantData: Merchant = {
      document_description: null,
      documents: null,
      _id: null,
      status: null,
      name,
      contact_number,
      email,
      company_description,
    };

    return this.http.post(`${this.apiUrl}/register-merchant`, merchantData);
  }

  /**
   * Upload documents for a merchant.
   *
   * @param {string} merchantId - The ID of the merchant for document upload.
   * @param {File[]} files - Array of files to be uploaded.
   * @param {string} documentDescription - Description of the uploaded documents.
   * @returns {Observable<any>} - Observable containing the document upload response.
   */
  uploadDocuments(
    merchantId: string,
    files: File[],
    documentDescription: string
  ): Observable<any> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('documents', files[i]);
    }
    formData.append('document_description', documentDescription);

    return this.http.post(`${this.apiUrl}/${merchantId}/upload`, formData);
  }

  /**
   * Get pending merchant applications.
   *
   * @returns {Observable<Merchant[]>} - Observable containing an array of pending merchant applications.
   */
  getPendingApplications(): Observable<Merchant[]> {
    return this.http.get<Merchant[]>(`${this.apiUrl}/pending`);
  }

  /**
   * Get merchant information by ID.
   *
   * @param {string} id - The ID of the merchant.
   * @returns {Observable<Merchant>} - Observable containing the merchant information.
   */
  getMerchantById(id: string): Observable<Merchant> {
    return this.http.get<Merchant>(`${this.apiUrl}/by-id/${id}`);
  }

  /**
   * Approve a merchant's application.
   *
   * @param {string} merchantId - The ID of the merchant to be approved.
   * @returns {Observable<any>} - Observable containing the approval response.
   */
  approveMerchant(merchantId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/approve/${merchantId}`, {});
  }

  /**
   * Reject a merchant's application.
   *
   * @param {string} merchantId - The ID of the merchant to be rejected.
   * @returns {Observable<any>} - Observable containing the rejection response.
   */
  rejectMerchant(merchantId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/reject/${merchantId}`, {});
  }

  /**
   * Send an email to a merchant.
   *
   * @param {string} to - The email address of the recipient.
   * @param {string} subject - The subject of the email.
   * @param {string} html - The HTML content of the email.
   * @returns {Observable<any>} - Observable containing the email sending response.
   */
  sendEmail(to: string, subject: string, html: string): Observable<any> {
    const emailData = { to, subject, html };
    return this.http.post<any>(`${this.apiUrl}/send-email`, emailData);
  }
}
