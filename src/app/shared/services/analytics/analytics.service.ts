import {Injectable} from '@angular/core';
import {OrderService} from '../order/order.service';
import {RegisterMerchantsService} from '../register-merchants.service';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {

  private apiUrl = 'http://localhost:3000/api/analytics';


  constructor(
    private http: HttpClient,

    private orderService: OrderService,
    private merchantsService: RegisterMerchantsService,
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

  /*getAllMerchantAnalytics() {
    const allMerchants = this.merchantsService.getMerchantsData();
    const allAnalytics = allMerchants.map((merchant) => {
      const productAnalytics = this.getMerchantProductAnalytics(merchant._id);
      const purchasingPowerAnalytics = this.getMerchantPurchasingPowerAnalytics(
        merchant._id
      );
      return {
        merchant,
        productAnalytics,
        purchasingPowerAnalytics,
      };
    });

    return allAnalytics;
  }*/
}
