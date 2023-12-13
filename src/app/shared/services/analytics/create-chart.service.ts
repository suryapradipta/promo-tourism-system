import {Injectable} from '@angular/core';
import {Chart, ChartData, ChartOptions} from "chart.js";
import {ChartConfiguration} from "chart.js/auto";

@Injectable({
  providedIn: 'root'
})
export class CreateChartService {

  private chartInstance: Chart;

  constructor() {
  }

  createChart(
    canvasId: string,
    chartConfig: ChartConfiguration
  ): void {
    const canvas: HTMLCanvasElement = document.getElementById(canvasId) as HTMLCanvasElement;

    if (canvas) {
      const context: CanvasRenderingContext2D = canvas.getContext('2d');

      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      this.chartInstance = new Chart(context, chartConfig);
    }
  };

  createChartData(labels: string[], data: number[], label: string): ChartData {
    return {
      labels,
      datasets: [
        {
          label: label,
          data,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          hoverBackgroundColor: 'rgba(153, 102, 255, 0.4)',
          borderColor: 'rgb(153, 102, 255)',
          borderWidth: 1,
          barPercentage: 0.5,
          borderRadius: 10,
        },
      ],
    };
  }

  createMultiChartData(labels: string[],
                       label1: string,
                       data1: number[],
                       label2: string,
                       data2: number[],
                       yAxisID?: string,
  ): ChartData {
    return {
      labels,
      datasets: [
        {
          label: label1,
          data: data1,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          hoverBackgroundColor: 'rgba(153, 102, 255, 0.4)',
          borderColor: 'rgb(153, 102, 255)',
          borderWidth: 1,
          barPercentage: 0.5,
          borderRadius: 10,
        },
        {
          label: label2,
          data: data2,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          hoverBackgroundColor: 'rgba(54, 162, 235, 0.4)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1,
          barPercentage: 0.5,
          borderRadius: 10,
          yAxisID: yAxisID,
        }
      ],
    };
  };

  createMultiChartOptions(
    xTitle: string,
    yTitle: string,
    title: string,
    secondaryTitle: string,
  ): ChartOptions {
    return {
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: xTitle,
            font: {
              weight: 'bold',
            },
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: yTitle,
            font: {
              weight: 'bold',
            },
          },
          ticks: {
            stepSize: 2000,
          },
          grid: {
            display: false,
          },
        },
        secondary: {
          title: {
            display: true,
            text: secondaryTitle,
            font: {
              weight: 'bold',
            },
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
          text: title,
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
    };
  };

  createChartOptions(
    title: string,
    xTitle: string,
    yTitle: string,
    indexAxis?: "x" | "y",
  ): ChartOptions {
    return {
      indexAxis: indexAxis || 'x',
      animation: {
        duration: 1000, easing: 'easeInOutQuart',
      },
      plugins: {
        title: {
          display: true,
          text: title,
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
            text: xTitle,
            font: {
              weight: 'bold',
            },
          },
          ticks: {
            stepSize: 1,
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: yTitle,
            font: {
              weight: 'bold',
            },
          },
          ticks: {
            stepSize: 1,
          },
        },
      },
    };
  };
}
