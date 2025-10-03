export const environment: {
  apiUrl: string;
  devicesRefreshDelay: number;
  deviceRetrieveDelay: number;
  deviceLogsRefreshDelay: number;
  retryCount: number;
  mock: boolean;
} = {
  // apiUrl: 'http://localhost:3001',
  apiUrl: 'https://machone-back.onrender.com',
  devicesRefreshDelay: 4, // minutes
  deviceRetrieveDelay: 6, // seconds
  deviceLogsRefreshDelay: 30, // minutes
  retryCount: 4,
  mock: false,
};
