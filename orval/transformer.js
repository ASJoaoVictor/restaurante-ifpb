/**
 * Transform the `{ [key: string]: unknown }` to `unknown` in generated code when object is empty
 */
function transformSchemaKeyStringToUnknown(schema) {
  schema.model = schema.model.replaceAll('{ [key: string]: unknown }', 'unknown')
}

/** @type {(generatorVerbOptions: import('orval').GeneratorVerbOptions) => import('orval').GeneratorVerbOptions} */
module.exports = (generatorVerbOptions) => {
  // Transform in the body
  generatorVerbOptions.body.schemas.forEach(transformSchemaKeyStringToUnknown)

  // Transform in the success responses
  generatorVerbOptions.response.types.success.forEach((success) => {
    success.schemas.forEach(transformSchemaKeyStringToUnknown)
  })

  // Transform in the error responses
  generatorVerbOptions.response.types.errors.forEach((error) => {
    error.schemas.forEach(transformSchemaKeyStringToUnknown)
  })

  return generatorVerbOptions
}
