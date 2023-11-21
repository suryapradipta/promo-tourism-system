import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../../../../shared/services';
import { Chart } from 'chart.js';
import { ChartConfiguration } from 'chart.js/auto';

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
  selector: 'app-ministry-analytics',
  templateUrl: './ministry-analytics.component.html',
  styleUrls: ['./ministry-analytics.component.css'],
})
export class MinistryAnalyticsComponent implements OnInit {
  allMerchantAnalytics: any;
  selectedMerchantId: string | null = null;

  allMerchantProductSold = true; // Default to show Product Sold Chart
  allMerchantPurchasingPower = false;
  selectedProductSold = true;
  selectedPurchasingPower = false;

  productSoldChart: Chart;
  purchasingPowerChart: Chart;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.allMerchantAnalytics = this.analyticsService.getAllMerchantAnalytics();
    this.showProductSoldChart();
  }

  showProductSoldChart(): void {
    this.allMerchantProductSold = true;
    this.allMerchantPurchasingPower = false;
    this.selectedMerchantId = null;
    setTimeout(() => this.AllProductSoldChart(), 0);
  }

  showPurchasingPowerChart(): void {
    this.allMerchantProductSold = false;
    this.allMerchantPurchasingPower = true;
    this.selectedMerchantId = null;
    setTimeout(() => this.AllPurchasingPowerChart(), 0);
  }

  showSelectedProductSold(): void {
    this.selectedProductSold = true;
    this.selectedPurchasingPower = false;
    this.allMerchantProductSold = false;
    this.allMerchantPurchasingPower = false;
    setTimeout(() => this.selectedProductSoldChart(), 0);
  }

  showSelectedPurchasingPower(): void {
    this.selectedProductSold = false;
    this.selectedPurchasingPower = true;
    this.allMerchantProductSold = false;
    this.allMerchantPurchasingPower = false;
    setTimeout(() => this.selectedPurchasingPowerChart(), 0);
  }

  onSelectMerchant(merchantId: string) {
    // Update selected merchant and refresh analytics data
    this.selectedMerchantId = merchantId;
    this.refreshAnalytics();
    this.allMerchantProductSold = false;
    this.allMerchantPurchasingPower = false;
    if (this.selectedMerchantId === '') {
      this.showProductSoldChart();
    }
  }

  refreshAnalytics() {
    if (this.selectedMerchantId) {
      // Get analytics data for the selected merchant
      const selectedMerchantAnalytics =
        this.analyticsService.getMerchantProductAnalytics(
          this.selectedMerchantId
        );

      const selectedMerchantPurchasingPowerAnalytics =
        this.analyticsService.getMerchantPurchasingPowerAnalytics(
          this.selectedMerchantId
        );

      // Update the specific merchant analytics in the allMerchantAnalytics array
      const index = this.allMerchantAnalytics.findIndex(
        (item) => item.merchant.id === this.selectedMerchantId
      );

      if (index !== -1) {
        this.allMerchantAnalytics[index].productAnalytics =
          selectedMerchantAnalytics;

        //  purchasing power analytics
        this.allMerchantAnalytics[index].purchasingPowerAnalytics =
          selectedMerchantPurchasingPowerAnalytics;
      }
      setTimeout(() => this.selectedProductSoldChart(), 0);
      setTimeout(() => this.selectedPurchasingPowerChart(), 0);
    }
  }

  private selectedProductSoldChart() {
    const canvas = <HTMLCanvasElement>(
      document.getElementById('selectedProductSoldChart')
    );
    const context = canvas.getContext('2d');

    if (this.productSoldChart) {
      this.productSoldChart.destroy();
    }

    const productAnalytics = this.allMerchantAnalytics.find(
      (item) => item.merchant.id === this.selectedMerchantId
    ).productAnalytics;
    const labels = productAnalytics.map((item) => item.product.name);
    const data = productAnalytics.map((item) => item.totalSold);

    const chartConfig: ChartConfiguration = {
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
          y: {
            beginAtZero: true,
          },
        },
      },
    };
    this.productSoldChart = new Chart(context, chartConfig);
  }

  private selectedPurchasingPowerChart() {
    const canvas = <HTMLCanvasElement>(
      document.getElementById('selectedPurchasingPowerChart')
    );
    const context = canvas.getContext('2d');

    if (this.purchasingPowerChart) {
      this.purchasingPowerChart.destroy();
    }

    const productAnalytics = this.allMerchantAnalytics.find(
      (item) => item.merchant.id === this.selectedMerchantId
    ).purchasingPowerAnalytics;

    const labels = Object.keys(productAnalytics);
    const data = Object.values(productAnalytics).map(
      (customer: any) => customer.totalSpent
    );

    const chartConfig: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Total Spent',
            data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        scales: {y: {beginAtZero: true}}}};
    this.purchasingPowerChart = new Chart(context, chartConfig);
  }

  private AllProductSoldChart() {
    const canvas = <HTMLCanvasElement>(
      document.getElementById('allProductSoldChart')
    );
    const context = canvas.getContext('2d');

    if (this.productSoldChart) {
      this.productSoldChart.destroy();
    }
    const labels = this.allMerchantAnalytics.map((item) => item.merchant.name);
    const data = this.allMerchantAnalytics.map((item) =>
      item.productAnalytics.reduce((sum, product) => sum + product.totalSold, 0)
    );
    const chartConfig: ChartConfiguration = {
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
        responsive: true,
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    };
    this.productSoldChart = new Chart(context, chartConfig);
  }

  private AllPurchasingPowerChart() {
    const canvas = <HTMLCanvasElement>(
      document.getElementById('allPurchasingPowerChart')
    );
    const context = canvas.getContext('2d');

    if (this.purchasingPowerChart) {
      this.purchasingPowerChart.destroy();
    }

    const labels = this.allMerchantAnalytics.map((item) => item.merchant.name);
    const purchasingPower = this.allMerchantAnalytics.map(
      (item) => item.purchasingPowerAnalytics
    );

    const data = [];

    // Iterate through each merchant's analytics
    purchasingPower.forEach((merchantAnalytics) => {
      // Iterate through each customer's analytics for the current merchant
      Object.keys(merchantAnalytics).forEach((customerEmail) => {
        const totalSpent = merchantAnalytics[customerEmail].totalSpent;
        data.push(totalSpent);
      });
    });

    const chartConfig: ChartConfiguration = {
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
          y: {
            beginAtZero: true,
          },
        },
      },
    };
    this.purchasingPowerChart = new Chart(context, chartConfig);
  }
}
