import {Component, OnInit} from '@angular/core';
import {AnalyticsService} from "../../../../../shared/services";
import {Chart} from "chart.js";
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
  styleUrls: ['./ministry-analytics.component.css']
})
export class MinistryAnalyticsComponent implements OnInit{
  allMerchantAnalytics: any;
  selectedMerchantId: string | null = null;

  showAllMerchantProductSold = true; // Default to show Product Sold Chart
  showAllMerchantPurchasingPower = false;

  myChart: Chart;
  myChart2: Chart;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    // Get analytics data for all merchants
    this.allMerchantAnalytics = this.analyticsService.getAllMerchantAnalytics();
    this.showProductSoldChart();
  }

  showProductSoldChart(): void {
    this.showAllMerchantProductSold = true;
    this.showAllMerchantPurchasingPower = false;
    this.selectedMerchantId = null;
    setTimeout(() => this.AllProductSoldChart(), 0);
  }

  showPurchasingPowerChart(): void {
    this.showAllMerchantProductSold = false;
    this.showAllMerchantPurchasingPower = true;
    this.selectedMerchantId = null;
    setTimeout(() => this.AllPurchasingPowerChart(), 0);
  }

  selectedProductSold = true;
  selectedPurchasingPower =false;
  showSelectedProductSold(): void {
    this.selectedProductSold = true;
    this.selectedPurchasingPower = false;
    this.showAllMerchantProductSold = false;
    this.showAllMerchantPurchasingPower = false;
    setTimeout(() => this.productChart(), 0);
  }

  showSelectedPurchasingPower(): void {
    this.selectedProductSold = false;
    this.selectedPurchasingPower = true;
    this.showAllMerchantProductSold = false;
    this.showAllMerchantPurchasingPower = false;
    setTimeout(() => this.purchasingChart(), 0);
  }


  onSelectMerchant(merchantId: string) {
    // Update selected merchant and refresh analytics data
    this.selectedMerchantId = merchantId;
    this.refreshAnalytics();
    this.showAllMerchantProductSold = false;
    this.showAllMerchantPurchasingPower = false;
    if (this.selectedMerchantId === '') {
      this.showProductSoldChart();
    }
  }

  refreshAnalytics() {
    if (this.selectedMerchantId) {
      // Get analytics data for the selected merchant
      const selectedMerchantAnalytics = this.analyticsService.getMerchantProductAnalytics(this.selectedMerchantId);

      // get purchasing power analytics
      const selectedMerchantPurchasingPowerAnalytics = this.analyticsService.getMerchantPurchasingPowerAnalytics(this.selectedMerchantId);

      // Update the specific merchant analytics in the allMerchantAnalytics array
      const index = this.allMerchantAnalytics.findIndex((item) => item.merchant.id === this.selectedMerchantId);

      if (index !== -1) {
        this.allMerchantAnalytics[index].productAnalytics = selectedMerchantAnalytics;

        //  purchasing power analytics
        this.allMerchantAnalytics[index].purchasingPowerAnalytics = selectedMerchantPurchasingPowerAnalytics;
      }
      setTimeout(() => this.productChart(), 0);
      setTimeout(() => this.purchasingChart(), 0);
    }
  }


  getSelectedPurchasingAnalytics() {
    // Find the selected merchant in the allMerchantAnalytics array

    const selectedMerchant = this.allMerchantAnalytics.find((item) => item.merchant.id === this.selectedMerchantId);
    return selectedMerchant ? selectedMerchant.purchasingPowerAnalytics : [];
  }


  private productChart() {
    const canvas = <HTMLCanvasElement>document.getElementById('myChart');
    const context = canvas.getContext('2d');

    if (this.myChart) {
      this.myChart.destroy();
    }

    const productAnalytics = this.allMerchantAnalytics.find(item => item.merchant.id === this.selectedMerchantId).productAnalytics;

    const labels = productAnalytics.map(item => item.product.name);
    const data = productAnalytics.map(item => item.totalSold)

    console.log('labels', labels);
    console.log('data', data);

    const chartConfig: ChartConfiguration ={
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
    };
    this.myChart = new Chart(context, chartConfig);
  }


  private purchasingChart() {
    const canvas = <HTMLCanvasElement>document.getElementById('purchase');
    const context = canvas.getContext('2d');

    if (this.myChart2) {
      this.myChart2.destroy();
    }

    const productAnalytics = this.allMerchantAnalytics.find(item => item.merchant.id === this.selectedMerchantId).purchasingPowerAnalytics;

    const labels = Object.keys(productAnalytics)
    const data = Object.values(productAnalytics).map((customer: any) => customer.totalSpent);

    console.log('labels', labels);
    console.log('data', data);

    const chartConfig: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Total Spent',
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
    };
    this.myChart2 = new Chart(context, chartConfig);
  }












  private AllProductSoldChart() {
    const labels = this.allMerchantAnalytics.map((item) => item.merchant.name);
    const data = this.allMerchantAnalytics.map((item) => item.productAnalytics.reduce((sum, product) => sum + product.totalSold, 0));
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
    });
  }




  private AllPurchasingPowerChart() {
    // Extract labels and data from purchasingPowerData
    const labels = this.allMerchantAnalytics.map((item) => item.merchant.name);
    const purchasingPower = this.allMerchantAnalytics.map((item)=>item.purchasingPowerAnalytics);


    const data = [];

// Iterate through each merchant's analytics
    purchasingPower.forEach((merchantAnalytics) => {
      // Iterate through each customer's analytics for the current merchant
      Object.keys(merchantAnalytics).forEach((customerEmail) => {
        const totalSpent = merchantAnalytics[customerEmail].totalSpent;
        data.push(totalSpent);
      });
    });

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
