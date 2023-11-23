/**
 * This component handles the display of analytics for a merchant, including charts
 * for product sales and purchasing power. It uses the AnalyticsService to retrieve
 * analytics data and the Chart.js library for rendering charts.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService, AuthService } from '../../../../../shared/services';
import { Chart, registerables } from 'chart.js';
import { PurchasingPowerModel } from '../../../../../shared/models';

Chart.register(...registerables);

@Component({
  selector: 'app-merchant-analytics',
  templateUrl: './merchant-analytics.component.html',
  styleUrls: ['./merchant-analytics.component.css'],
})
export class MerchantAnalyticsComponent implements OnInit {
  merchantProductAnalytics: any;
  merchantPurchasingPowerAnalytics: PurchasingPowerModel = {};
  showProductSold = true;
  showPurchasingPower = false;

  /**
   * @constructor
   * @param {AnalyticsService} analyticsService - Service for fetching analytics data.
   * @param {AuthService} authService - Service for managing user authentication.
   */
  constructor(
    private analyticsService: AnalyticsService,
    private authService: AuthService
  ) {}

  /**
   * Fetches analytics data for the current merchant and calls the function to show
   * the product sold chart.
   */
  ngOnInit(): void {
    this.merchantProductAnalytics =
      this.analyticsService.getMerchantProductAnalytics(
        this.authService.getCurrentUser().id
      );
    this.merchantPurchasingPowerAnalytics =
      this.analyticsService.getMerchantPurchasingPowerAnalytics(
        this.authService.getCurrentUser().id
      );
  }

  /**
   * Lifecycle hook called after the view has been initialized.
   * Calls the function to show the product sold chart.
   */
  ngAfterViewInit(): void {
    this.showProductSoldChart();
  }

  /**
   * Switches to displaying the product sold chart.
   */
  showProductSoldChart(): void {
    this.showProductSold = true;
    this.showPurchasingPower = false;
    setTimeout(() => this.productSoldChart(), 0);
  }

  /**
   * Switches to displaying the purchasing power chart.
   */
  showPurchasingPowerChart(): void {
    this.showProductSold = false;
    this.showPurchasingPower = true;
    setTimeout(() => this.purchasingPowerChart(), 0);
  }

  /**
   * Renders the product sold chart using Chart.js.
   */
  private productSoldChart() {
    const labels = this.merchantProductAnalytics.map(
      (item) => item.product.name
    );
    const data = this.merchantProductAnalytics.map((item) => item.totalSold);

    const myChart = new Chart('productSoldChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Total Sold',
            data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }

  /**
   * Renders the purchasing power chart using Chart.js.
   */
  private purchasingPowerChart() {
    const labels = Object.keys(this.merchantPurchasingPowerAnalytics);
    const data = Object.values(this.merchantPurchasingPowerAnalytics).map(
      (customer) => [customer.totalSpent, customer.totalOrders]
    );

    const myChart = new Chart('purchasingPowerChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Total Spent, Total Orders',
            data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }
}
