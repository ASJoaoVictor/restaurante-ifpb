import type { Config } from 'jest'
import { createDefaultPreset } from 'ts-jest'

const config: Config = {
  ...createDefaultPreset(),
  globalSetup: '<rootDir>/test/setup.ts',
  globalTeardown: '<rootDir>/test/teardown.ts',
  passWithNoTests: true
}

export default config
