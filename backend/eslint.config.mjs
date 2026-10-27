import eslintConfigNest from '@josejefferson/eslint-config-nest'
import eslintConfigReact from '@josejefferson/eslint-config-react'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['temp', 'src/migrations']),
  eslintConfigNest,
  eslintConfigReact,
  {
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'process',
          property: 'env',
          message: "Don't use process.env directly, use env.config.ts instead."
        }
      ]
    }
  }
])
