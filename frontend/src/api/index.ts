import axios, { AxiosError, AxiosRequestConfig } from 'axios'

export const baseURL = import.meta.env.VITE_API_ENDPOINT || ''
export const api = axios.create({ baseURL, withCredentials: true })

export const axiosInstance = async <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  const { data } = await api({ ...config, ...options })
  return data
}

export type NestJsException = { statusCode: number; message: string; error: string }

export type ErrorType<Error> = AxiosError<Error extends unknown ? NestJsException : Error>

export function getUploadUrl(fileName: string): string {
  return `${baseURL}/api/public/uploads/${fileName}`
}
