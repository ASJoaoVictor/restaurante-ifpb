import { prepareZXingModule } from 'barcode-detector'

export * from './components/Scanner'
export * from './hooks/useDevices'
export * from './misc/overlays'
export * from './types'

export { setZXingModuleOverrides, prepareZXingModule } from 'barcode-detector'

prepareZXingModule({
  overrides: {
    locateFile(url, scriptDirectory) {
      if (url.endsWith('zxing_reader.wasm')) {
        return '/lib/zxing_reader.wasm'
      }
      return scriptDirectory + url
    }
  }
})
