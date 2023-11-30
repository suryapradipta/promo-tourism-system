/**
 * This service provides methods to retrieve analytics data related to product sales and
 * customer purchasing power for merchants and all merchants in the system.
 */
import { Injectable } from '@angular/core';
import { ProductListService } from './product-list.service';
import { OrderService } from './order.service';
import { RegisterMerchantsService } from './register-merchants.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  /**
   * Initializes the service with dependencies.
   *
   * @constructor
   * @param {ProductListService} productService - The service responsible for product-related data.
   * @param {OrderService} orderService - The service responsible for order-related data.
   * @param {RegisterMerchantsService} merchantsService - The service responsible for merchant-related data.
   * @param {AuthService} authService - The service responsible for user authentication.
   */
  constructor(
    private productService: ProductListService,
    private orderService: OrderService,
    private merchantsService: RegisterMerchantsService,
    private authService: AuthService
  ) {}

  /**
   * Get analytics data for products sold for the current merchant.
   *
   * @param {string} merchantId - ID of the current merchant.
   * @returns {object[]} - Array of objects containing product analytics data.
   */
  getMerchantProductAnalytics(merchantId: string) {
    const products = this.productService.getProductsData();
    const merchantProducts = products.filter(
      (p) => p.merchantId === merchantId
    );
    const orders = this.orderService.getOrdersByMerchant(merchantId);

    const productAnalytics = merchantProducts.map((product) => {
      const productOrders = orders.filter(
        (order) => order.product.id === product.id
      );
      return {
        product,
        totalSold: productOrders.length,
      };
    });

    return productAnalytics;
  }

  /**
   * Get analytics data for customers purchasing power for the current merchant.
   *
   * @param {string} merchantId - ID of the current merchant.
   * @returns {object} - Object containing customer purchasing power analytics data.
   */
  getMerchantPurchasingPowerAnalytics(merchantId: string) {
    const orders = this.orderService.getOrdersByMerchant(merchantId);

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

  /**
   * Get analytics data for all merchants.
   *
   * @returns {object[]} - Array of objects containing analytics data for all merchants.
   */
  getAllMerchantAnalytics() {
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
  }
}
