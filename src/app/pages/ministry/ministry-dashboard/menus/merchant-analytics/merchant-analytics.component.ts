import {Component, OnInit} from '@angular/core';
import {
  AnalyticsService,
  AuthService,
  MerchantService
} from '../../../../../shared/services';
import {Chart, registerables} from 'chart.js';
import {CustomerPurchasingPower} from "../../../../../shared/models";

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

  constructor(
    private analyticsService: AnalyticsService,
    private authService: AuthService,
    private merchantService: MerchantService
  ) {
  }

  async ngOnInit(): Promise<void> {
    const email: string = this.authService.getCurrentUserJson().email;
    const response = await this.merchantService.getMerchantIdByEmail(email).toPromise()

    this.analyticsService
      .getMerchantProductAnalytics(response.merchantId)
      .subscribe((data) => {
        this.productAnalytics = data;
        this.productSoldChart()
      });


    this.analyticsService
      .getMerchantPurchasingPowerAnalytics(response.merchantId)
      .subscribe(
        (data: CustomerPurchasingPower[]) => {
          this.customerPurchasingPower = data;
          console.log(this.customerPurchasingPower);
          this.purchasingPowerChart()

        },
        (error) => {
          console.error('Error fetching purchasing power analytics:', error);
          // Handle error: Display a user-friendly error message
        }
      );


  }

  ngAfterViewInit(): void {
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
    const labels = this.productAnalytics.map((item) => item.name);
    const data = this.productAnalytics.map((item) => item.totalSold);

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
          y: {beginAtZero: true},
        },
      },
    });
  }

  private purchasingPowerChart() {
    const labels = this.customerPurchasingPower.map((customer) => customer.email);
    const data = Object.values(this.customerPurchasingPower).map(
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
          y: {beginAtZero: true},
        },
      },
    });
  }
}
