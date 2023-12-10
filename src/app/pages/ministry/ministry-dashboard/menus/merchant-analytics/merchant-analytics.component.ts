import {Component, OnInit} from '@angular/core';
import {
  AnalyticsService,
  AuthService, CreateChartService,
  MerchantService
} from '../../../../../shared/services';
import {Chart, registerables} from 'chart.js';
import {CustomerPurchasingPower} from "../../../../../shared/models";
import {ChartConfiguration} from "chart.js/auto";

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


  constructor(
    private analyticsService: AnalyticsService,
    private authService: AuthService,
    private merchantService: MerchantService,
    private createChartService: CreateChartService
  ) {
  }

  async ngOnInit(): Promise<void> {
    const email: string = this.authService.getCurrentUserJson().email;
    const response = await this.merchantService.getMerchantIdByEmail(email).toPromise()

    this.analyticsService
      .getProductAnalyticsAndStats(response.merchantId)
      .subscribe((data) => {
        this.productAnalytics = data.productAnalytics;
        this.productSoldStats = data.stats;
        this.productSoldChart();
      },
        (error) => {
          console.error(
            'Error  :',
            error
          );
        });

    this.analyticsService
      .getPurchasingPowerAnalyticsAndStats(response.merchantId)
      .subscribe((data) => {
        this.customerPurchasingPower = data.customerPurchasingPower;
        this.purchasingPowerStats = data.stats;
        this.purchasingPowerChart();
      },
        (error) => {
          console.error(
            'Error :',
            error
          );
        });
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

  private purchasingPowerChart = (): void => {
    const labels: string[] = this.customerPurchasingPower.map((customer) => customer.email);
    const totalSpent: number[] = Object.values(this.customerPurchasingPower).map(
      (customer: CustomerPurchasingPower) => customer.totalSpent
    );
    const totalOrders: number[] = Object.values(this.customerPurchasingPower).map(
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
        'Number of Orders',
      )
    };
    this.createChartService.createChart('purchasingPowerChart', chartConfig);

  };
}
