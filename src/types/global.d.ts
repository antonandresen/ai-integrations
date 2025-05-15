/**
 * Global type declarations
 */

declare module 'axios' {
  interface AxiosRequestConfig {
    responseType?: string
    signal?: AbortSignal
  }

  interface AxiosResponse<T = any> {
    data: T
    status: number
    statusText: string
    headers: Record<string, string>
    config: AxiosRequestConfig
    request?: any
  }

  interface AxiosError<T = any> extends Error {
    config: AxiosRequestConfig
    code?: string
    request?: any
    response?: AxiosResponse<T>
    isAxiosError: boolean
    toJSON: () => object
  }

  interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<AxiosResponse>
    (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse>
    defaults: AxiosRequestConfig
    get: <T = any>(
      url: string,
      config?: AxiosRequestConfig,
    ) => Promise<AxiosResponse<T>>
    post: <T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
    ) => Promise<AxiosResponse<T>>
    put: <T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
    ) => Promise<AxiosResponse<T>>
    delete: <T = any>(
      url: string,
      config?: AxiosRequestConfig,
    ) => Promise<AxiosResponse<T>>
    patch: <T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
    ) => Promise<AxiosResponse<T>>
  }

  const axios: AxiosInstance
  export default axios
}

declare module 'eventsource-parser' {
  export interface ParsedEvent {
    type: string
    data: string
  }

  export interface ReconnectInterval {
    type: 'reconnect-interval'
    value: number
  }

  export type EventSourceParserOnParseCallback = (
    event: ParsedEvent | ReconnectInterval,
  ) => void

  export interface EventSourceParser {
    feed: (chunk: string) => any
    reset: () => void
  }

  export function createParser(
    onParse: EventSourceParserOnParseCallback,
  ): EventSourceParser
}
