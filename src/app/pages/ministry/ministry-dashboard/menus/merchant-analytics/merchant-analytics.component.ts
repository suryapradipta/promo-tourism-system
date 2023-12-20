/**
 * This component is responsible for displaying analytics data for a merchant, including
 * charts for product sales and customer purchasing power. It interacts with the AnalyticsService,
 * AuthService, MerchantService, CreateChartService, NotificationService, and LoadingService
 * to fetch and display the necessary data.
 */
import { Component, OnInit } from '@angular/core';
import {
  AnalyticsService,
  AuthService,
  CreateChartService,
  LoadingService,
  MerchantService,
  NotificationService,
} from '../../../../../shared/services';
import { Chart, registerables } from 'chart.js';
import { CustomerPurchasingPower } from '../../../../../shared/models';
import { ChartConfiguration } from 'chart.js/auto';

Chart.register(...registerables);

@Component({
  selector: 'app-merchant-analytics',
  templateUrl: './merchant-analytics.component.html',
  styleUrls: ['./merchant-analytics.component.css'],
})
export class MerchantAnalyticsComponent implements OnInit {
  productAnalytics: any[];
  customerPurchasingPower: CustomerPurchasingPower[];
  showProductSold = true;
  showPurchasingPower = false;
  productSoldStats: any = {};
  purchasingPowerStats: any = {};

  /**
   * @constructor
   * @param {AnalyticsService} analyticsService - Service for fetching analytics data.
   * @param {AuthService} authService - Service for user authentication.
   * @param {MerchantService} merchantService - Service for merchant-related operations.
   * @param {CreateChartService} createChartService - Service for creating charts.
   * @param {NotificationService} alert - Service for displaying notifications.
   * @param {LoadingService} loading - Service for managing loading indicators.
   */
  constructor(
    private analyticsService: AnalyticsService,
    private authService: AuthService,
    private merchantService: MerchantService,
    private createChartService: CreateChartService,
    private alert: NotificationService,
    private loading: LoadingService
  ) {}

  /**
   * Fetches merchant ID, product analytics, and purchasing power analytics data
   * from respective services and updates the charts accordingly.
   *
   * @returns {Promise<void>}
   */
  async ngOnInit(): Promise<void> {
    const email: string = this.authService.getCurrentUserJson().email;
    const response = await this.merchantService
      .getMerchantIdByEmail(email)
      .toPromise();

    this.loading.show();
    this.analyticsService
      .getProductAnalyticsAndStats(response.merchantId)
      .subscribe(
        (data) => {
          this.loading.hide();

          this.productAnalytics = data.productAnalytics;
          this.productSoldStats = data.stats;
          this.productSoldChart();
        },
        (error) => {
          this.loading.hide();

          console.error('Error while fetching product analytics:', error);

          if (error.status === 404) {
            this.alert.showErrorMessage('Merchant not found');
          } else {
            const errorMessage =
              error.error?.message || 'Failed to fetch product analytics';
            this.alert.showErrorMessage(errorMessage);
          }
        }
      );

    this.loading.show();
    this.analyticsService
      .getPurchasingPowerAnalyticsAndStats(response.merchantId)
      .subscribe(
        (data) => {
          this.loading.hide();
          this.customerPurchasingPower = data.customerPurchasingPower;
          this.purchasingPowerStats = data.stats;
          this.purchasingPowerChart();
        },
        (error) => {
          this.loading.hide();

          console.error(
            'Error while fetching purchasing power analytics:',
            error
          );

          if (error.status === 404) {
            this.alert.showErrorMessage('Merchant not found');
          } else {
            const errorMessage =
              error.error?.message || 'Failed to fetch analytics';
            this.alert.showErrorMessage(errorMessage);
          }
        }
      );
  }

  /**
   * Display the product sold chart.
   */
  showProductSoldChart(): void {
    this.showProductSold = true;
    this.showPurchasingPower = false;
    setTimeout(() => this.productSoldChart(), 0);
  }

  /**
   * Display the purchasing power chart.
   */
  showPurchasingPowerChart(): void {
    this.showProductSold = false;
    this.showPurchasingPower = true;
    setTimeout(() => this.purchasingPowerChart(), 0);
  }

  /**
   * Generate and display the product sold chart using Chart.js.
   * Uses the CreateChartService to create the chart configuration.
   */
  private productSoldChart = (): void => {
    const labels: any[] = this.productAnalytics.map((item) => item.name);
    const data: number[] = this.productAnalytics.map((item) => item.totalSold);

    const chartConfig: ChartConfiguration = {
      type: 'bar',
      data: this.createChartService.createChartData(labels, data, 'Total Sold'),
      options: this.createChartService.createChartOptions(
        'Products Sold Analytics',
        'Number of Product Sold',
        'Products Name',
        'y'
      ),
    };
    this.createChartService.createChart('productSoldChart', chartConfig);
  };

  /**
   * Generate and display the purchasing power chart using Chart.js.
   * Uses the CreateChartService to create the chart configuration.
   */
  private purchasingPowerChart = (): void => {
    const labels: string[] = this.customerPurchasingPower.map(
      (customer) => customer.email
    );
    const totalSpent: number[] = Object.values(
      this.customerPurchasingPower
    ).map((customer: CustomerPurchasingPower) => customer.totalSpent);
    const totalOrders: number[] = Object.values(
      this.customerPurchasingPower
    ).map((customer: CustomerPurchasingPower) => customer.totalOrders);

    const chartConfig: ChartConfiguration = {
      type: 'bar',
      data: this.createChartService.createMultiChartData(
        labels,
        'Total Spent',
        totalSpent,
        'Total Orders',
        totalOrders,
        'secondary'
      ),
      options: this.createChartService.createMultiChartOptions(
        'Customers Email',
        'Amount Spent ($)',
        'Customer Purchasing Power Analytics',
        'Number of Orders'
      ),
    };
    this.createChartService.createChart('purchasingPowerChart', chartConfig);
  };
}
