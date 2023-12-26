/**
 * This service interacts with the server's analytics API to retrieve various analytics
 * and statistics related to products, purchasing power, and all merchants.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private apiUrl = 'http://localhost:3000/api/analytics';

  /**
   * @constructor
   * @param {HttpClient} http - Angular's HTTP client for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Get product analytics and statistics for a specific merchant.
   *
   * @param {string} merchantId - The ID of the merchant for whom analytics are requested.
   * @returns {Observable<any>} - Observable containing the product analytics and stats.
   */
  getProductAnalyticsAndStats(merchantId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/product-analytics-and-stats/${merchantId}`
    );
  }

  /**
   * Get purchasing power analytics and statistics for a specific merchant.
   *
   * @param {string} merchantId - The ID of the merchant for whom analytics are requested.
   * @returns {Observable<any>} - Observable containing the purchasing power analytics and stats.
   */
  getPurchasingPowerAnalyticsAndStats(merchantId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/purchasing-power-analytics-and-stats/${merchantId}`
    );
  }

  /**
   * Get all merchant analytics and statistics.
   *
   * @returns {Observable<any>} - Observable containing analytics and stats for all merchants.
   */
  getAllMerchantAnalyticsAndStats(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/all-merchant-analytics-and-stats`
    );
  }
}
