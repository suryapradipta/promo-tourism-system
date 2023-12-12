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
  //all analytics
  selectedMerchantId: string | null = null;
  allMerchantStats: any = {};
  productSoldStats: any = {};
  purchasingPowerStats: any = {};

  // Flags to control the visibility of different charts
  isAllProductSold: boolean = true;
  isAllPurchasingPower: boolean = false;
  isSelectedProductSold: boolean = true;
  isSelectedPurchasingPower: boolean = false;

  constructor(
    private analyticsService: AnalyticsService,
    private createChartService: CreateChartService,
    private alert: NotificationService,
    private loading: LoadingService
  ) {}

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

  showProductSoldChart(): void {
    this.isAllProductSold = true;
    this.isAllPurchasingPower = false;
    this.selectedMerchantId = null;
    setTimeout(() => this.productSoldAnalytics(), 0);
  }

  showPurchasingPowerChart(): void {
    this.isAllProductSold = false;
    this.isAllPurchasingPower = true;
    this.selectedMerchantId = null;
    setTimeout(() => this.purchasingPowerAnalytics(), 0);
  }

  showSelectedProductSold(): void {
    this.isSelectedProductSold = true;
    this.isSelectedPurchasingPower = false;
    this.isAllProductSold = false;
    this.isAllPurchasingPower = false;
    setTimeout(() => this.selectedProductSoldChart(), 0);
  }

  showSelectedPurchasingPower(): void {
    this.isSelectedProductSold = false;
    this.isSelectedPurchasingPower = true;
    this.isAllProductSold = false;
    this.isAllPurchasingPower = false;
    setTimeout(() => this.selectedPurchasingPowerChart(), 0);
  }

  onSelectMerchant(merchantId: string): void {
    this.selectedMerchantId = merchantId;
    this.refreshAnalytics();
    this.isAllProductSold = false;
    this.isAllPurchasingPower = false;
    if (this.selectedMerchantId === '') {
      this.showProductSoldChart();
    }
  }

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
