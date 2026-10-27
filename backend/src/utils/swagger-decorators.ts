import { applyDecorators } from '@nestjs/common'
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsOptional } from 'class-validator'

export function ApiStringProperty(options: ApiPropertyOptions = {}) {
  return ApiProperty({ type: 'string', example: '', ...options })
}

export function ApiNonEmptyStringProperty(options: ApiPropertyOptions & { example?: string } = {}) {
  return ApiStringProperty({ minLength: 1, ...options })
}

export function ApiUUIDProperty(options: ApiPropertyOptions = {}) {
  return ApiNonEmptyStringProperty({ format: 'uuid', example: '00000000-0000-0000-0000-000000000000', ...options })
}

export function ApiEmailProperty(options: ApiPropertyOptions = {}) {
  return ApiNonEmptyStringProperty({ format: 'email', example: 'user@email.com', ...options })
}

export function ApiPhoneProperty(options: ApiPropertyOptions = {}) {
  return ApiNonEmptyStringProperty({ format: 'phone', example: '(11) 98765-4321', ...options })
}

export function ApiURLProperty(options: ApiPropertyOptions = {}) {
  return ApiNonEmptyStringProperty({ format: 'uri', example: 'https://example.com', ...options })
}

export function ApiJWTProperty(options: ApiPropertyOptions = {}) {
  return ApiNonEmptyStringProperty({
    format: 'jwt',
    example: 'eyJhbGciOiJIUzI1NiIs...Jf36POk6yJV_adQssw5c',
    ...options
  })
}

export function ApiHashedPasswordProperty(options: ApiPropertyOptions = {}) {
  return ApiNonEmptyStringProperty({
    format: 'password',
    example: '$2a$12$WjkVNYwwZAKs4L.qPXQzvOVuSq5GKeHVHJqh7MMiQ3wxAwGo7Tt62',
    ...options
  })
}

export function ApiEnumProperty(enumType: string[] | readonly string[], options: ApiPropertyOptions = {}) {
  return ApiProperty({ enum: enumType, example: enumType[0], ...options })
}

export function ApiBooleanProperty(options: ApiPropertyOptions = {}) {
  return ApiProperty({ type: 'boolean', example: false, ...options })
}

export function ApiNumberProperty(options: ApiPropertyOptions = {}) {
  return ApiProperty({ type: 'number', example: 0, ...options })
}

export function ApiDateProperty(options: ApiPropertyOptions = {}) {
  return ApiProperty({ type: 'string', format: 'date', example: '2025-01-01', ...options })
}

export function ApiTimeProperty(options: ApiPropertyOptions = {}) {
  return ApiProperty({ type: 'string', format: 'time', example: '12:00:00', ...options })
}

export function ApiDateTimeProperty(options: ApiPropertyOptions = {}) {
  return ApiProperty({ type: 'string', format: 'date-time', example: '2025-01-01T12:00:00Z', ...options })
}

export function ApiClassProperty(classDef: { new (): any }, options: ApiPropertyOptions = {}) {
  return ApiProperty({ type: classDef, ...options })
}

export function ApiStringArrayProperty(options: ApiPropertyOptions = {}) {
  return ApiProperty({ type: 'string', isArray: true, example: ['item1', 'item2'], ...options })
}

export function ApiFileProperty(options: ApiPropertyOptions = {}) {
  return ApiProperty({ type: 'string', format: 'binary', ...options })
}
