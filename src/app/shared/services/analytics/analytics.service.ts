import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {

  private apiUrl = 'http://localhost:3000/api/analytics';


  constructor(
    private http: HttpClient,
  ) {
  }

  getMerchantProductAnalytics(merchantId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/product-analytics/${merchantId}`);
  }

  getMerchantPurchasingPowerAnalytics(merchantId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/purchasing-power-analytics/${merchantId}`);
  }

  getAllMerchantAnalytics(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all-merchant-analytics`);
  }

  getProductAnalyticsAndStats(merchantId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/product-analytics-and-stats/${merchantId}`);
  }

  getPurchasingPowerAnalyticsAndStats(merchantId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/purchasing-power-analytics-and-stats/${merchantId}`);
  }

}
