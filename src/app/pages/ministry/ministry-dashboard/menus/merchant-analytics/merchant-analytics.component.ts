import {Component, OnInit} from '@angular/core';
import {
  AnalyticsService,
  AuthService
} from "../../../../../shared/services";
import { Chart, registerables} from 'chart.js';

Chart.register(...registerables);

/*
* error: the TypeScript error "Property 'totalSpent' does not exist on type 'unknown'"
* solution: explicitly define the type
* */
interface PurchasingPowerData {
  [email: string]: {
    totalSpent: number;
    totalOrders: number;
  };
}
@Component({
  selector: 'app-merchant-analytics',
  templateUrl: './merchant-analytics.component.html',
  styleUrls: ['./merchant-analytics.component.css']
})
export class MerchantAnalyticsComponent implements OnInit{
  merchantProductAnalytics: any;
  merchantPurchasingPowerAnalytics: PurchasingPowerData={};
  showProductSold = true; // Default to show Product Sold Chart
  showPurchasingPower = false;


  constructor(private analyticsService: AnalyticsService,
              private authService: AuthService) {}

  ngOnInit(): void {
    // Get analytics data for the current merchant
    this.merchantProductAnalytics = this.analyticsService.getMerchantProductAnalytics(this.authService.getCurrentUser().id);
    this.merchantPurchasingPowerAnalytics = this.analyticsService.getMerchantPurchasingPowerAnalytics(this.authService.getCurrentUser().id);
  }
  ngAfterViewInit(): void {
    // Call the chart functions after the view has been initialized
    this.showProductSoldChart();
  }

  showProductSoldChart(): void {
    this.showProductSold = true;
    this.showPurchasingPower = false;
    setTimeout(() => this.productSoldChart(), 0);
  }

  showPurchasingPowerChart(): void {
    this.showProductSold = false;
    this.showPurchasingPower = true;
    setTimeout(() => this.purchasingPowerChart(), 0);
  }

  private productSoldChart() {
    const labels = this.merchantProductAnalytics.map(item => item.product.name);
    const data = this.merchantProductAnalytics.map(item => item.totalSold);

    const myChart = new Chart('productSoldChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Total Sold',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }],
      },
      options: {
        indexAxis: 'y',
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  private purchasingPowerChart() {
    // Extract labels and data from purchasingPowerData
    const labels = Object.keys(this.merchantPurchasingPowerAnalytics);
    const data = Object.values(this.merchantPurchasingPowerAnalytics).map((customer) => [
      customer.totalSpent,
      customer.totalOrders
    ]);

    // Create a bar chart
    const myChart = new Chart('purchasingPowerChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Total Spent, Total Orders',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
