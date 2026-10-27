import { Type } from '@nestjs/common'
import { getSchemaPath } from '@nestjs/swagger'
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'
import { count } from 'drizzle-orm'
import { PgSelect } from 'drizzle-orm/pg-core'
import { db } from '../drizzle/drizzle.module'

export const MAX_PAGE = 10000
export const MAX_PAGE_SIZE = 100

export async function withPagination<Query extends PgSelect, CountQuery extends PgSelect>(
  qb: Query,
  countQb: CountQuery,
  page: number,
  pageSize: number
): Promise<Paginated<Awaited<Query>[number]>> {
  const [{ count: total }] = await countQb
  const result = await qb.limit(pageSize).offset((page - 1) * pageSize)

  return {
    items: result,
    count: result.length,
    total,
    page,
    pageCount: Math.ceil(total / pageSize),
    pageSize
  }
}

export function getPaginationAPISchema<TModel extends Type>(model: TModel): SchemaObject {
  return {
    allOf: [
      {
        properties: {
          items: {
            type: 'array',
            items: { $ref: getSchemaPath(model) }
          },
          count: { type: 'number' },
          total: { type: 'number' },
          page: { type: 'number' },
          pageCount: { type: 'number' },
          pageSize: { type: 'number' }
        }
      }
    ]
  }
}

export interface Paginated<T> {
  items: T[]
  count: number
  total: number
  page: number
  pageCount: number
  pageSize: number
}
