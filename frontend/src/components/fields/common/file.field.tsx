import {
  Box,
  FileUpload,
  FileUploadFileError,
  FileUploadFileMimeType,
  Icon,
  Spinner,
  Text,
  useFileUpload
} from '@chakra-ui/react'
import { ControllerProps, FieldValues, Path } from 'react-hook-form'
import { RiUploadLine } from 'react-icons/ri'
import { FileUploadRootProps } from '../../ui/file-upload'
import { HookField, HookFieldProps } from './hook-field'

export interface FileFieldProps<T extends FieldValues> extends Omit<HookFieldProps<T>, 'validate'> {
  /** Name of the field */
  name: Path<T>

  /** Tipos de arquivos aceitos */
  accept?: FileUploadFileMimeType[]

  /** Número máximo de arquivos */
  maxFiles?: number

  /** Tamanho máximo do arquivo em bytes */
  maxFileSize?: number

  /** Tamanho mínimo do arquivo em bytes */
  minFileSize?: number

  /** Função de validação customizada */
  validate?: FileUploadRootProps['validate']

  /** Texto principal */
  mainText?: string

  /** Texto secundário */
  secondaryText?: string
}

export function FileField<T extends FieldValues>(props: FileFieldProps<T>) {
  const { validate, ...rest } = props

  return (
    <HookField<T> {...rest}>
      {(controllerProps) => <FileUploadInner<T> controllerProps={controllerProps} props={props} />}
    </HookField>
  )
}

interface FileUploadInnerProps<T extends FieldValues> {
  controllerProps: Parameters<ControllerProps<T>['render']>[0]
  props: FileFieldProps<T>
}

function FileUploadInner<T extends FieldValues>({ controllerProps, props }: FileUploadInnerProps<T>) {
  const { field, fieldState, formState } = controllerProps

  const maxFiles = props.maxFiles ?? 1
  const isMultiple = maxFiles > 1

  const fileUpload = useFileUpload({
    maxFiles,
    maxFileSize: props.maxFileSize,
    minFileSize: props.minFileSize,
    validate: props.validate,
    accept: props.accept,
    disabled: formState.isSubmitting || props.disabled,
    onFileChange(details) {
      if (isMultiple) {
        field.onChange(details.acceptedFiles)
      } else {
        field.onChange(details.acceptedFiles[0])
      }
    }
  })

  return (
    <FileUpload.RootProvider
      alignItems="stretch"
      value={fileUpload}
      opacity={fileUpload.disabled ? 0.5 : 1}
      cursor={fileUpload.disabled ? 'not-allowed' : undefined}
    >
      <FileUpload.HiddenInput ref={field.ref} />

      <FileUpload.Dropzone borderColor={fieldState.invalid ? 'red.solid' : undefined}>
        {formState.isSubmitting ? (
          <Spinner size="lg" />
        ) : (
          <Icon size="2xl" color="fg.muted">
            <RiUploadLine />
          </Icon>
        )}
        <FileUpload.DropzoneContent userSelect="none">
          <Box>
            {props.mainText ||
              `Arraste e solte ${isMultiple ? 'os arquivos' : 'o arquivo'} aqui, ou clique para selecionar`}
          </Box>
          <Box color="fg.muted" hidden={!props.secondaryText}>
            {props.secondaryText}
          </Box>
        </FileUpload.DropzoneContent>
      </FileUpload.Dropzone>

      {fileUpload.rejectedFiles.map((file, i) => (
        <Text key={i} color="fg.error" textStyle="sm">
          O arquivo &quot;{file.file.name}&quot; não é aceito:{' '}
          {file.errors.map((error) => ERROR_MESSAGES[error] || error).join(', ')}
        </Text>
      ))}

      <FileUpload.List clearable showSize />
    </FileUpload.RootProvider>
  )
}

const ERROR_MESSAGES: Record<FileUploadFileError, string> = {
  TOO_MANY_FILES: 'Muitos arquivos adicionados',
  FILE_INVALID_TYPE: 'Tipo de arquivo inválido',
  FILE_TOO_LARGE: 'Arquivo muito grande',
  FILE_TOO_SMALL: 'Arquivo muito pequeno',
  FILE_INVALID: 'Arquivo inválido',
  FILE_EXISTS: 'Arquivo já existe'
}
