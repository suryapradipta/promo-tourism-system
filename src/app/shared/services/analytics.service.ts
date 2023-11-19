import { Injectable } from '@angular/core';
import {ProductListService} from "./product-list.service";
import {OrderService} from "./order.service";
import {RegisterMerchantsService} from "./register-merchants.service";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private productService: ProductListService,
              private orderService: OrderService,
              private merchantsService:RegisterMerchantsService,
              private authService:AuthService) {}


// Get analytics data for products sold for the current merchant
  getMerchantProductAnalytics() {
    const merchantId = this.authService.getCurrentUser().id;

    const products = this.productService.getProductsData();
    const merchantProducts = products.filter((p) => p.merchantId === merchantId);

    const orders = this.orderService.getOrdersByMerchant(merchantId);

    // Process analytics data
    const productAnalytics = merchantProducts.map((product) => {
      const productOrders = orders.filter((order) => order.product.id === product.id);
      return {
        product,
        totalSold: productOrders.length,
      };
    });

    return productAnalytics;
  }

  // Get analytics data for customers purchasing power for the current merchant
  getMerchantPurchasingPowerAnalytics() {
    const merchantId = this.authService.getCurrentUser().id;

    const orders = this.orderService.getOrdersByMerchant(merchantId);

    // Process analytics data
    const customerPurchasingPower = orders.reduce((acc, order) => {
      const customerEmail = order.email;

      if (!acc[customerEmail]) {
        acc[customerEmail] = {
          totalSpent: 0,
          totalOrders: 0,
        };
      }

      acc[customerEmail].totalSpent += order.quantity * order.totalAmount;
      acc[customerEmail].totalOrders += 1;

      return acc;
    }, {});

    return customerPurchasingPower;
  }

  /*// Get analytics data for all merchants
  getAllMerchantAnalytics() {
    const allMerchants = this.merchantsService.getMerchantsData();
    const allAnalytics = allMerchants.map((merchant) => {
      const productAnalytics = this.getMerchantProductAnalytics(merchant.id);
      const purchasingPowerAnalytics = this.getMerchantPurchasingPowerAnalytics(merchant.id);

      return {
        merchant,
        productAnalytics,
        purchasingPowerAnalytics,
      };
    });

    return allAnalytics;
  }*/


}
