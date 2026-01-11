export const environment: {
  apiUrl: string;
  refreshDelay: number;
  waitingDelay: number;
  retryCount: number;
  mock: boolean;
} = {
  apiUrl: 'https://machone-back.onrender.com',
  refreshDelay: 60 * 4,
  waitingDelay: 6,
  retryCount: 4,
  mock: false,
};
