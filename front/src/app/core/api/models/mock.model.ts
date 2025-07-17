export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface MockConfig {
  [endpoint: string]: {
    [method in HttpMethod]?: unknown
  };
}
