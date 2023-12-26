/**
 * This component manages the display of analytics for ministry users,
 * including charts for product sold and customer purchasing power.
 */
import { Component, OnInit } from '@angular/core';
import {
  AnalyticsService,
  CreateChartService,
  LoadingService,
  NotificationService,
} from '../../../../../shared/services';
import { ChartConfiguration } from 'chart.js/auto';
import { CustomerPurchasingPower } from '../../../../../shared/models';

@Component({
  selector: 'app-ministry-analytics',
  templateUrl: './ministry-analytics.component.html',
  styleUrls: ['./ministry-analytics.component.css'],
})
export class MinistryAnalyticsComponent implements OnInit {
  allAnalytics: any;
  selectedMerchantId: string | null = null;
  allMerchantStats: any = {};
  productSoldStats: any = {};
  purchasingPowerStats: any = {};
  isAllProductSold: boolean = true;
  isAllPurchasingPower: boolean = false;
  isSelectedProductSold: boolean = true;
  isSelectedPurchasingPower: boolean = false;

  /**
   * @constructor
   * @param {AnalyticsService} analyticsService - Service for fetching analytics data.
   * @param {CreateChartService} createChartService - Service for creating charts.
   * @param {NotificationService} alert - Service for displaying notifications.
   * @param {LoadingService} loading - Service for managing loading indicators.
   */
  constructor(
    private analyticsService: AnalyticsService,
    private createChartService: CreateChartService,
    private alert: NotificationService,
    private loading: LoadingService
  ) {}

  /**
   * Fetches initial analytics data on component initialization.
   */
  ngOnInit(): void {
    this.loading.show();

    this.analyticsService.getAllMerchantAnalyticsAndStats().subscribe(
      (data) => {
        this.loading.hide();

        this.allAnalytics = data.allAnalytics;
        this.allMerchantStats = data.stats;
        this.showProductSoldChart();
      },
      (error) => {
        this.loading.hide();

        console.error('Error fetching analytics:', error);

        if (error.status === 500) {
          this.alert.showErrorMessage('Internal Server Error');
        } else {
          const errorMessage =
            error.error?.message || 'Failed to fetch analytics';
          this.alert.showErrorMessage(errorMessage);
        }
      }
    );
  }

  /**
   * Show the chart displaying the total products sold by all merchants.
   */
  showProductSoldChart(): void {
    this.isAllProductSold = true;
    this.isAllPurchasingPower = false;
    this.selectedMerchantId = null;
    setTimeout(() => this.productSoldAnalytics(), 0);
  }

  /**
   * Show the chart displaying the total customer purchasing power by all merchants.
   */
  showPurchasingPowerChart(): void {
    this.isAllProductSold = false;
    this.isAllPurchasingPower = true;
    this.selectedMerchantId = null;
    setTimeout(() => this.purchasingPowerAnalytics(), 0);
  }

  /**
   * Show the chart displaying the products sold by the currently selected merchant.
   */
  showSelectedProductSold(): void {
    this.isSelectedProductSold = true;
    this.isSelectedPurchasingPower = false;
    this.isAllProductSold = false;
    this.isAllPurchasingPower = false;
    setTimeout(() => this.selectedProductSoldChart(), 0);
  }

  /**
   * Show the chart displaying the customer purchasing power by the currently selected merchant.
   */
  showSelectedPurchasingPower(): void {
    this.isSelectedProductSold = false;
    this.isSelectedPurchasingPower = true;
    this.isAllProductSold = false;
    this.isAllPurchasingPower = false;
    setTimeout(() => this.selectedPurchasingPowerChart(), 0);
  }

  /**
   * Handle the selection of a specific merchant.
   * @param {string} merchantId - The ID of the selected merchant.
   */
  onSelectMerchant(merchantId: string): void {
    this.selectedMerchantId = merchantId;
    this.refreshAnalytics();
    this.isAllProductSold = false;
    this.isAllPurchasingPower = false;
    if (this.selectedMerchantId === '') {
      this.showProductSoldChart();
    }
  }

  /**
   * Refresh analytics data based on the selected merchant.
   */
  refreshAnalytics(): void {
    if (this.selectedMerchantId) {
      const index = this.allAnalytics.findIndex(
        (item) => item.merchant._id === this.selectedMerchantId
      );

      if (index !== -1) {
        this.loading.show();

        this.analyticsService
          .getProductAnalyticsAndStats(this.selectedMerchantId)
          .subscribe((data) => {
            this.loading.hide();

            this.allAnalytics[index].productAnalytics = data.productAnalytics;
            this.productSoldStats = data.stats;

            setTimeout(() => this.selectedProductSoldChart(), 0);
          });

        this.loading.show();

        this.analyticsService
          .getPurchasingPowerAnalyticsAndStats(this.selectedMerchantId)
          .subscribe(
            (data) => {
              this.loading.hide();

              this.allAnalytics[index].purchasingPowerAnalytics =
                data.customerPurchasingPower;
              this.purchasingPowerStats = data.stats;

              setTimeout(() => this.selectedPurchasingPowerChart(), 0);
            },
            (error) => {
              this.loading.hide();

              console.error(
                'Error fetching purchasing power analytics:',
                error
              );
            }
          );
      }
    } else {
      this.loading.show();

      this.analyticsService.getAllMerchantAnalyticsAndStats().subscribe(
        (data) => {
          this.loading.hide();

          this.allAnalytics = data.allAnalytics;
          this.allMerchantStats = data.stats;
          this.showProductSoldChart();
        },
        (error) => {
          this.loading.hide();

          console.error('Error fetching analytics:', error);

          if (error.status === 500) {
            this.alert.showErrorMessage('Internal Server Error');
          } else {
            const errorMessage =
              error.error?.message || 'Failed to fetch analytics';
            this.alert.showErrorMessage(errorMessage);
          }
        }
      );
    }
  }

  /**
   * Create and display the chart for products sold by the currently selected merchant.
   */
  private selectedProductSoldChart(): void {
    const productAnalytics = this.allAnalytics.find(
      (item) => item.merchant._id === this.selectedMerchantId
    ).productAnalytics;
    const labels = productAnalytics.map((item) => item.name);
    const data = productAnalytics.map((item) => item.totalSold);

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

    this.createChartService.createChart(
      'selectedProductSoldChart',
      chartConfig
    );
  }

  /**
   * Create and display the chart for customer purchasing power by the currently selected merchant.
   */
  private selectedPurchasingPowerChart(): void {
    const productAnalytics: CustomerPurchasingPower[] = this.allAnalytics.find(
      (item) => item.merchant._id === this.selectedMerchantId
    ).purchasingPowerAnalytics;

    const labels: string[] = productAnalytics.map((customer) => customer.email);
    const totalSpent: number[] = Object.values(productAnalytics).map(
      (customer: CustomerPurchasingPower) => customer.totalSpent
    );
    const totalOrders: number[] = Object.values(productAnalytics).map(
      (customer: CustomerPurchasingPower) => customer.totalOrders
    );

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
    this.createChartService.createChart(
      'selectedPurchasingPowerChart',
      chartConfig
    );
  }

  /**
   * Create and display the chart for customer purchasing power by all merchants.
   */
  private purchasingPowerAnalytics(): void {
    const labels = this.allAnalytics.map((item) => item.merchant.name);
    const totalSpent = this.allAnalytics.map(
      (item) => item.purchasingPowerAnalytics.totalSpent
    );
    const totalOrders = this.allAnalytics.map(
      (item) => item.purchasingPowerAnalytics.totalOrders
    );

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
        'Products Name',
        'Amount Spent ($)',
        'Customer Purchasing Power Analytics',
        'Number of Orders'
      ),
    };
    this.createChartService.createChart('allPurchasingPowerChart', chartConfig);
  }

  /**
   * Create and display the chart for products sold by all merchants.
   */
  private productSoldAnalytics(): void {
    const labels = this.allAnalytics.map((item) => item.merchant.name);
    const data = this.allAnalytics.map(
      (item) => item.productAnalytics.totalSold
    );
    const chartConfig: ChartConfiguration = {
      type: 'bar',
      data: this.createChartService.createChartData(labels, data, 'Total Sold'),
      options: this.createChartService.createChartOptions(
        'Products Sold Analytics',
        'Merchants Name',
        'Number of Product Sold'
      ),
    };
    this.createChartService.createChart('allProductSoldChart', chartConfig);
  }
}
