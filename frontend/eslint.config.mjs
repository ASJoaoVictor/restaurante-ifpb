import eslintConfigReact from '@josejefferson/eslint-config-react'
import eslintConfigTypescript from '@josejefferson/eslint-config-typescript'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['src/lib/**']),
  eslintConfigTypescript,
  eslintConfigReact,
  {
    rules: {
      // This rule is disabled due to the use of `throw redirect` from @tanstack/react-router
      '@typescript-eslint/only-throw-error': 'off'
    }
  },
  {
    files: ['**/components/ui/**/*.{ts,tsx}'],
    rules: {
      // This rule is disabled due to the "import type" components from Chakra UI
      'no-duplicate-imports': 'off'
    }
  }
])
