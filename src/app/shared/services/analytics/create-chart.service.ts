/**
 * This service provides methods to create and manage Chart.js charts and their configurations.
 * It includes functions for creating single and multi-dataset charts, defining chart data, and
 * specifying chart options such as titles and axis labels.
 */
import { Injectable } from '@angular/core';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { ChartConfiguration } from 'chart.js/auto';

@Injectable({
  providedIn: 'root',
})
export class CreateChartService {
  private chartInstance: Chart;

  /**
   * Create a Chart.js chart with the provided configuration on the specified canvas element.
   * If a previous chart instance exists, it is destroyed before creating the new one.
   *
   * @param {string} canvasId - The ID of the HTML canvas element to render the chart.
   * @param {ChartConfiguration} chartConfig - Configuration options for the Chart.js chart.
   */
  createChart(canvasId: string, chartConfig: ChartConfiguration): void {
    const canvas: HTMLCanvasElement = document.getElementById(
      canvasId
    ) as HTMLCanvasElement;

    if (canvas) {
      const context: CanvasRenderingContext2D = canvas.getContext('2d');

      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      this.chartInstance = new Chart(context, chartConfig);
    }
  }

  /**
   * Create chart data for a single-dataset bar chart.
   *
   * @param {string[]} labels - Array of labels for the chart data.
   * @param {number[]} data - Array of numerical data values.
   * @param {string} label - Label for the dataset.
   * @returns {ChartData} - Chart data configuration object.
   */
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

  /**
   * Create chart data for a multi-dataset bar chart.
   *
   * @param {string[]} labels - Array of labels for the chart data.
   * @param {string} label1 - Label for the first dataset.
   * @param {number[]} data1 - Array of numerical data values for the first dataset.
   * @param {string} label2 - Label for the second dataset.
   * @param {number[]} data2 - Array of numerical data values for the second dataset.
   * @param {string | undefined} yAxisID - ID of the y-axis for the second dataset.
   * @returns {ChartData} - Chart data configuration object.
   */
  createMultiChartData(
    labels: string[],
    label1: string,
    data1: number[],
    label2: string,
    data2: number[],
    yAxisID?: string
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
        },
      ],
    };
  }

  /**
   * Create chart options for a multi-dataset bar chart.
   *
   * @param {string} xTitle - Title for the x-axis.
   * @param {string} yTitle - Title for the y-axis.
   * @param {string} title - Title for the chart.
   * @param {string} secondaryTitle - Title for the secondary y-axis (if applicable).
   * @returns {ChartOptions} - Chart options configuration object.
   */
  createMultiChartOptions(
    xTitle: string,
    yTitle: string,
    title: string,
    secondaryTitle: string
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
            stepSize: 2,
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
  }

  /**
   * Create chart options for a single-dataset bar chart or line chart.
   *
   * @param {string} title - Title for the chart.
   * @param {string} xTitle - Title for the x-axis.
   * @param {string} yTitle - Title for the y-axis.
   * @param {'x' | 'y' | undefined} indexAxis - Axis to index the data along.
   * @returns {ChartOptions} - Chart options configuration object.
   */
  createChartOptions(
    title: string,
    xTitle: string,
    yTitle: string,
    indexAxis?: 'x' | 'y'
  ): ChartOptions {
    return {
      indexAxis: indexAxis || 'x',
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
            stepSize: 2,
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
            stepSize: 2,
          },
        },
      },
    };
  }
}
