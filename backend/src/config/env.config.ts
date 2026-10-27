import { bool, cleanEnv, EnvError, makeValidator, port } from 'envalid'

// Custom string validator that checks for non-empty strings
const str = makeValidator<string>((input: string) => {
  if (typeof input !== 'string') throw new EnvError(`Not a string: "${input}"`)
  if (input.trim() === '') throw new EnvError('String cannot be empty')
  return input
})

// eslint-disable-next-line no-restricted-properties
export const env = cleanEnv(process.env, {
  // Application configuration
  NODE_ENV: str({
    default: 'development',
    choices: ['development', 'production', 'test'],
    desc: 'Defines the application environment (e.g., development, production, test)'
  }),
  PORT: port({ default: 3000, desc: 'Port the application will listen on' }),
  APP_URL: str({
    desc: 'Base URL of the application, e.g., http://localhost:3000 or https://myapp.com',
    default: 'http://localhost:5173'
  }),
  BACKEND_APP_URL: str({
    desc: 'Base URL of the backend application, e.g., http://localhost:3000 or https://myapp.com',
    default: 'http://localhost:3000'
  }),

  // Database configuration
  DATABASE_URL: str({ desc: 'PostgreSQL database connection URL' }),

  // Session and JWT configuration
  JWT_SECRET: str({ desc: 'Secret key used to sign JWT tokens' }),

  // QR code signature configuration
  QR_CODE_PUBLIC_KEY: str({ desc: 'Public key used for QR code signature verification', default: '' }),
  QR_CODE_PRIVATE_KEY: str({ desc: 'Private key used for QR code signature generation', default: '' }),

  // CORS configuration
  ENABLE_CORS_COOKIE: bool({ default: false, desc: 'Enables or disables cross-origin cookie usage (CORS)' }),

  // E-mail configuration
  GMAIL_CLIENT_ID: str({ desc: 'OAuth2 client ID for Gmail authentication', default: '' }),
  GMAIL_CLIENT_SECRET: str({ desc: 'OAuth2 client secret for Gmail authentication', default: '' }),
  GMAIL_EMAIL: str({ desc: 'Gmail email address used as sender', default: '' }),
  GMAIL_NAME: str({ desc: 'Sender name used in outgoing emails', default: '' }),
  GMAIL_REFRESH_TOKEN: str({ desc: 'OAuth2 refresh token for Gmail access', default: '' }),
  TEST_EMAIL: str({ desc: 'Email address used for testing purposes', default: '' }),

  // Google Login configuration
  GOOGLE_CLIENT_ID: str({ desc: 'OAuth2 client ID used for Google login', default: '' }),

  // Vercel
  VERCEL: str({ desc: 'Indicates if the application is running on Vercel', default: '' }),
  BLOB_STORE_ID: str({ desc: 'Vercel Blob Store ID', default: '' })
})
