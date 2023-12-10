import {Component, OnInit} from '@angular/core';
import {AnalyticsService} from '../../../../../shared/services';
import {Chart, ChartDataset} from 'chart.js';
import {ChartConfiguration} from 'chart.js/auto';
import {CustomerPurchasingPower} from '../../../../../shared/models';
import _default from "chart.js/dist/plugins/plugin.legend";
import labels = _default.defaults.labels;
import {data} from "autoprefixer";

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

  // Chart instances for Product Sold and Purchasing Power
  productSoldChart: Chart;
  purchasingPowerChart: Chart;

  constructor(private analyticsService: AnalyticsService) {
  }

  ngOnInit(): void {
    this.analyticsService
      .getAllMerchantAnalyticsAndStats()
      .subscribe((data) => {
        this.allAnalytics = data.allAnalytics;
        this.allMerchantStats = data.stats;
        console.log(this.allMerchantStats);
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
          .getProductAnalyticsAndStats(this.selectedMerchantId)
          .subscribe((data) => {
            this.allAnalytics[index].productAnalytics = data.productAnalytics;
            this.productSoldStats = data.stats;

            setTimeout(() => this.selectedProductSoldChart(), 0);
          });

        this.analyticsService
          .getPurchasingPowerAnalyticsAndStats(this.selectedMerchantId)
          .subscribe(
            (data) => {
              this.allAnalytics[index].purchasingPowerAnalytics =
                data.customerPurchasingPower;
              this.purchasingPowerStats = data.stats;

              setTimeout(() => this.selectedPurchasingPowerChart(), 0);
            },
            (error) => {
              console.error(
                'Error fetching purchasing power analytics:',
                error
              );
            }
          );
      }
    } else {
      this.analyticsService
        .getAllMerchantAnalyticsAndStats()
        .subscribe((data) => {
          this.allAnalytics = data.allAnalytics;
          this.allMerchantStats = data.stats;
          this.showProductSoldChart();
        });
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
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            hoverBackgroundColor: 'rgba(153, 102, 255, 0.4)',
            borderColor: 'rgb(153, 102, 255)',
            borderWidth: 1,
            barPercentage: 0.5,
            borderRadius: 10,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart',
        },
        plugins: {
          title: {
            display: true,
            text: 'Products Sold Analytics',
            font: {
              size: 16,
            },
          },
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        aspectRatio: 1.8,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Products Name',
            },
          },
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Product Sold',
            },
            ticks: {
              stepSize: 1,
            },

          },
        },
      },
    }
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

    const labels: string[] = productAnalytics.map((customer) => customer.email);
    const totalSpent: number[] = Object.values(productAnalytics).map(
      (customer: CustomerPurchasingPower) => customer.totalSpent
    );

    const totalOrders: number[] = Object.values(productAnalytics).map(
      (customer: CustomerPurchasingPower) => customer.totalOrders
    );

    const chartConfig: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Total Spent',
            data: totalSpent,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            hoverBackgroundColor: 'rgba(153, 102, 255, 0.4)',
            borderColor: 'rgb(153, 102, 255)',
            borderWidth: 1,
            barPercentage: 0.5,
            borderRadius: 10,
          },
          {
            label: 'Total Orders',
            data: totalOrders ,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            hoverBackgroundColor: 'rgba(54, 162, 235, 0.4)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
            barPercentage: 0.5,
            borderRadius: 10,
            yAxisID: 'secondary',
          }
        ],
      },
      options: {
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Customers Email',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount Spent ($)',
            },
            ticks: {
              stepSize: 2000,
            },
          },
          secondary: {
            title: {
              display: true,
              text: 'Number of Orders',
            },
            beginAtZero: true,
            position: 'right',
            ticks: {
              stepSize: 1,
            },
          },
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart',
        },
        plugins: {
          title: {
            display: true,
            text: 'Customer Purchasing Power Analytics',
            font: {
              size: 16,
            },
          },
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        aspectRatio: 1.8,
      },
    };
    this.purchasingPowerChart = new Chart(context, chartConfig);
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
    const totalSpent = this.allAnalytics.map(
      (item) => item.purchasingPowerAnalytics.totalSpent
    );
    const totalOrders = this.allAnalytics.map(
      (item) => item.purchasingPowerAnalytics.totalOrders
    );

    const chartConfig: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Total Spent',
            data: totalSpent,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            hoverBackgroundColor: 'rgba(153, 102, 255, 0.4)',
            borderColor: 'rgb(153, 102, 255)',
            borderWidth: 1,
            barPercentage: 0.5,
            borderRadius: 10,
          },
          {
            label: 'Total Orders',
            data: totalOrders ,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            hoverBackgroundColor: 'rgba(54, 162, 235, 0.4)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
            barPercentage: 0.5,
            borderRadius: 10,
            yAxisID: 'secondary',
          }
        ],
      },
      options: {
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Products Name',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount Spent ($)',
            },
            ticks: {
              stepSize: 2000,
            },
          },
          secondary: {
            title: {
              display: true,
              text: 'Number of Orders',
            },
            beginAtZero: true,
            position: 'right',
            ticks: {
              stepSize: 1,
            },
          },
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart',
        },
        plugins: {
          title: {
            display: true,
            text: 'Customer Purchasing Power Analytics',
            font: {
              size: 16,
            },
          },
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        aspectRatio: 1.8,
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
    const data = this.allAnalytics.map(
      (item) => item.productAnalytics.totalSold
    );
    const chartConfig: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Total Sold',
            data,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            hoverBackgroundColor: 'rgba(153, 102, 255, 0.4)',
            borderColor: 'rgb(153, 102, 255)',
            borderWidth: 1,
            barPercentage: 0.5,
            borderRadius: 10,
          }
        ],
      },
      options: {
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart',
        },
        plugins: {
          title: {
            display: true,
            text: 'Products Sold Analytics',
            font: {
              size: 16,
            },
          },
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        aspectRatio: 1.8,
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Merchants Name',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Product Sold',
            },
            ticks: {
              stepSize: 1,
            },

          },
        },
      },
    };
    this.productSoldChart = new Chart(context, chartConfig);
  }
}


