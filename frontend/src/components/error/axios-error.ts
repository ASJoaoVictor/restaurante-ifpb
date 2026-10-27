import { AxiosError } from 'axios'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { ToasterOptions } from './get-error'

interface ServerError {
  statusCode?: StatusCodes
  error?: string
  message?: string
}

export function getAxiosError(error: AxiosError<ServerError>): ToasterOptions {
  const { code, response } = error
  const { status, data } = response ?? {}

  if (code === 'ERR_NETWORK') {
    return { title: 'Erro de conexão', description: 'Verifique sua conexão com a internet' }
  }

  if (code === 'ETIMEDOUT') {
    return {
      title: 'Tempo esgotado',
      description: 'O servidor demorou muito para responder. Tente novamente mais tarde'
    }
  }

  if (code === 'ERR_CANCELED') {
    return { title: 'Requisição cancelada', description: 'A requisição foi cancelada pelo usuário ou pelo sistema' }
  }

  if (code === 'ERR_BAD_REQUEST' || code === 'ERR_BAD_RESPONSE') {
    if (!data) {
      return {
        title: status ? `Erro ${status} ${getReasonPhrase(status)}` : 'Erro desconhecido',
        description: 'O servidor retornou uma resposta inválida'
      }
    }

    if (data.statusCode && data.error) {
      return getHTTPExceptionMessage(data)
    }

    const statusText = getReasonPhrase(data?.statusCode || status!)
    return {
      title: `Erro ${status} ${statusText}`,
      description: data?.message || 'O servidor retornou um erro desconhecido'
    }
  }

  return { title: 'Erro desconhecido', description: error.message }
}

function getHTTPExceptionMessage(data: ServerError): ToasterOptions {
  if (data.statusCode === StatusCodes.BAD_REQUEST) {
    return {
      title: 'Erro de requisição',
      description: data.message || 'A requisição não pôde ser processada pelo servidor'
    }
  }

  if (data.statusCode === StatusCodes.UNAUTHORIZED) {
    return {
      title: 'Login necessário',
      description: data.message || 'Você precisa fazer login para acessar este recurso'
    }
  }

  if (data.statusCode === StatusCodes.FORBIDDEN) {
    return {
      title: 'Acesso negado',
      description: data.message || 'Você não tem permissão para acessar este recurso'
    }
  }

  if (data.statusCode === StatusCodes.NOT_FOUND) {
    return {
      title: 'Recurso não encontrado',
      description: data.message || 'O recurso solicitado não foi encontrado no servidor'
    }
  }

  if (data.statusCode === StatusCodes.UNPROCESSABLE_ENTITY) {
    return {
      title: 'Erro de validação',
      description: data.message || 'Os dados enviados não são válidos'
    }
  }

  if (data.statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
    return {
      title: data.error === 'Database Error' ? 'Erro no banco de dados' : 'Erro interno do servidor',
      description: data.message || 'Ocorreu um erro interno no servidor'
    }
  }

  if (data.statusCode === StatusCodes.BAD_GATEWAY) {
    return {
      title: 'Serviço indisponível',
      description: 'O servidor está temporariamente indisponível. Tente novamente mais tarde',
      action: {
        label: 'Atualizar página',
        onClick: () => window.location.reload()
      }
    }
  }

  return {
    title: `Erro ${data.statusCode} ${data.error}`,
    description: data.message || 'O servidor retornou um erro desconhecido'
  }
}
