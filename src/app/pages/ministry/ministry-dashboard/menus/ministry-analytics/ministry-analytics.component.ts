import {Component, OnInit} from '@angular/core';
import {AnalyticsService} from '../../../../../shared/services';
import {Chart} from 'chart.js';
import {ChartConfiguration} from 'chart.js/auto';
import {CustomerPurchasingPower} from '../../../../../shared/models';

@Component({
  selector: 'app-ministry-analytics',
  templateUrl: './ministry-analytics.component.html',
  styleUrls: ['./ministry-analytics.component.css'],
})
export class MinistryAnalyticsComponent implements OnInit {
  allAnalytics: any;
  //all analytics
  selectedMerchantId: string | null = null;

  // Flags to control the visibility of different charts
  isAllProductSold: boolean = true;
  isAllPurchasingPower: boolean = false;
  isSelectedProductSold: boolean = true;
  isSelectedPurchasingPower: boolean = false;

  // Chart instances for Product Sold and Purchasing Power
  productSoldChart: Chart;
  purchasingPowerChart: Chart;

  constructor(private analyticsService: AnalyticsService) {
  }

  ngOnInit(): void {
    this.analyticsService.getAllMerchantAnalytics().subscribe((data) => {
      this.allAnalytics = data;
      this.showProductSoldChart();
    });
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

  onSelectMerchant(merchantId: string) {
    this.selectedMerchantId = merchantId;
    this.refreshAnalytics();
    this.isAllProductSold = false;
    this.isAllPurchasingPower = false;
    if (this.selectedMerchantId === '') {
      this.showProductSoldChart();
    }
  }

  refreshAnalytics() {
    if (this.selectedMerchantId) {
      const index = this.allAnalytics.findIndex(
        (item) => item.merchant._id === this.selectedMerchantId
      );

      if (index !== -1) {
        this.analyticsService
          .getMerchantProductAnalytics(this.selectedMerchantId)
          .subscribe((data) => {
            this.allAnalytics[index].productAnalytics = data;
            setTimeout(() => this.selectedProductSoldChart(), 0);
          });

        this.analyticsService
          .getMerchantPurchasingPowerAnalytics(this.selectedMerchantId)
          .subscribe(
            (data: CustomerPurchasingPower[]) => {
              this.allAnalytics[index].purchasingPowerAnalytics = data;
              setTimeout(() => this.selectedPurchasingPowerChart(), 0);
            },
            (error) => {
              console.error('Error fetching purchasing power analytics:', error);
            }
          );

      }
    }
  }

  private selectedProductSoldChart() {
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>(
      document.getElementById('selectedProductSoldChart')
    );
    const context: CanvasRenderingContext2D = canvas.getContext('2d');

    if (this.productSoldChart) {
      this.productSoldChart.destroy();
    }

    const productAnalytics = this.allAnalytics.find(
      (item) => item.merchant._id === this.selectedMerchantId
    ).productAnalytics;
    const labels = productAnalytics.map((item) => item.name);
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
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>(
      document.getElementById('selectedPurchasingPowerChart')
    );
    const context: CanvasRenderingContext2D = canvas?.getContext('2d');

    if (this.purchasingPowerChart) {
      this.purchasingPowerChart.destroy();
    }

    const productAnalytics: CustomerPurchasingPower[] = this.allAnalytics.find(
      (item) => item.merchant._id === this.selectedMerchantId
    ).purchasingPowerAnalytics;
    console.log('productAnalytics', productAnalytics);

    const labels = productAnalytics.map((customer) => customer.email);
    const data: number[] = Object.values(productAnalytics).map(
      (customer) => customer.totalSpent
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
        scales: { y: { beginAtZero: true } },
      },
    };
    this.purchasingPowerChart = new Chart(context, chartConfig);
  }





















  private productSoldAnalytics() {
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>(
      document.getElementById('allProductSoldChart')
    );
    const context: CanvasRenderingContext2D = canvas.getContext('2d');

    if (this.productSoldChart) {
      this.productSoldChart.destroy();
    }
    const labels = this.allAnalytics.map((item) => item.merchant.name);
    const data = this.allAnalytics.map((item) => item.productAnalytics.totalSold);
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

  private purchasingPowerAnalytics() {
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>(
      document.getElementById('allPurchasingPowerChart')
    );
    const context: CanvasRenderingContext2D = canvas.getContext('2d');

    if (this.purchasingPowerChart) {
      this.purchasingPowerChart.destroy();
    }

    const labels = this.allAnalytics.map((item) => item.merchant.name);
    const data = this.allAnalytics.map((item) => item.purchasingPowerAnalytics.totalSpent);



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
