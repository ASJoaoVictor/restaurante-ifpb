import { axiosInstance } from '@/api'
import { UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'

export interface PaginatedData<T> {
  items?: T[]
  count?: number
  total?: number
  page?: number
  pageCount?: number
  pageSize?: number
}

export interface PaginatedQueryParams {
  page: number
  pageSize: number
  orderBy?: any
  orderDirection?: 'asc' | 'desc'
  search?: string
}

export type OrvalPaginatedQuery<T, TError = Error> = (
  params: PaginatedQueryParams,
  options?: {
    query?: UseQueryOptions<PaginatedData<T>, TError, PaginatedData<T>>
    request?: Parameters<typeof axiosInstance>[1]
  }
) => UseQueryResult<PaginatedData<T>, TError>

export type OrvalGetAllWithoutPagination<T, TError = Error> = (options?: {
  query?: UseQueryOptions<T[], TError, T[]>
  request?: Parameters<typeof axiosInstance>[1]
}) => UseQueryResult<T[], TError>

export type OrvalRemoveQuery<T, TError = Error> = (options?: {
  mutation?: UseMutationOptions<T, TError, { id: string }>
  request?: Parameters<typeof axiosInstance>[1]
}) => UseMutationResult<T, TError, { id: string }>

export type OrvalPaginatedGetQueryKey = (params?: PaginatedQueryParams) => readonly unknown[]
