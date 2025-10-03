import { ChartDataset, ChartOptions } from 'chart.js';

// Period of logs to retrieve
export const logsPeriod = 24; // hours

// Granularity of data points in chart to avoid overlapping
export const chartGranularity = 30; // minutes

export const colors = {
  temperature: '#444855',
  temperaturePoint: 'lightgrey',

  temperatureSet: '#444855',
  temperatureSetPoint: 'lightgrey',

  stateOpen: '#c72e24',
  stateClose: '#004d98',
};

export const chartOptions: ChartOptions<'line'> = {
  maintainAspectRatio: false,
  scales: {
    y: {
      suggestedMin: 5,
      suggestedMax: 30,
      ticks: { callback: (value) => `${value}°` },
    },
    x: {
      type: 'time',
      time: { displayFormats: { hour: 'H\'h\'' } },
      ticks: { maxRotation: 0 },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      displayColors: false,
      callbacks: {
        title: (context) => {
          const dataset = context[0].raw as { x: Date };
          return dataset.x.toLocaleString();
        },
        label: (context) => {
          const dataset = context.raw as { y: number };
          return `${context.dataset.label}: ${dataset.y.toFixed(1)}°`;
        },
      },
    },
  },
};

export const datasetOptionsTemperature: Partial<ChartDataset<'line'>> = {
  label: 'Temperature',
  borderColor: colors.temperature,
  pointHitRadius: 6,
  pointRadius: 0,
  pointBackgroundColor: colors.temperaturePoint,
  pointHoverRadius: 4,
  pointHoverBackgroundColor: colors.temperatureSetPoint,
  tension: 0.4,
};

export const datasetOptionsTemperatureSet: Partial<ChartDataset<'line'>> = {
  label: 'Temperature set',
  borderColor: colors.temperatureSet,
  pointHitRadius: 6,
  pointRadius: 2,
  pointBackgroundColor: colors.temperatureSetPoint,
  pointHoverRadius: 4,
  pointHoverBackgroundColor: colors.temperatureSetPoint,
  stepped: true,
  borderDash: [
    5,
    5,
  ],
};
