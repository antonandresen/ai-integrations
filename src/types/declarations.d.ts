/**
 * Custom type declarations for third-party libraries
 */

declare module 'axios' {
  export interface AxiosRequestConfig {
    headers?: Record<string, string>
    // Add other properties as needed
  }

  export default function axios(config: AxiosRequestConfig): Promise<any>
}

declare module 'eventsource-parser' {
  export interface ParsedEvent {
    type: string
    data: string
    id?: string
  }

  export interface ReconnectInterval {
    interval: number
  }

  export function createParser(options: {
    onParse: (event: ParsedEvent | ReconnectInterval) => void
  }): {
    feed: (chunk: string) => void
    reset: () => void
  }
} 