import { getAlunosGetAllQueryKey, useAlunosDefinirFaltas, useAlunosRemoverSuspensao } from '@/api/endpoints/alunos'
import { Aluno } from '@/api/endpoints/api.schemas'
import { useAuth } from '@/contexts/auth'
import { isSuspenso } from '@/utils/aluno'
import { Badge, Button, ButtonGroup, Center, IconButton } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { RiAddLine, RiSubtractLine } from 'react-icons/ri'
import { toastError } from '../error/toast-error'
import { toaster } from '../ui/toaster'
import { Tooltip } from '../ui/tooltip'

export function AlunoFaltasDisplay({ aluno, somenteVisualizacao }: { aluno: Aluno; somenteVisualizacao?: boolean }) {
  const { me } = useAuth()
  const limite = me.campus?.maximoDeFaltas ?? 0
  const queryClient = useQueryClient()

  const { mutateAsync: definirFaltas, isPending } = useAlunosDefinirFaltas({
    mutation: {
      onSuccess(alunoAtualizado) {
        void queryClient.invalidateQueries({ queryKey: getAlunosGetAllQueryKey() })
        if (!isSuspenso(aluno) && isSuspenso(alunoAtualizado)) {
          toaster.warning({
            title: `O aluno "${aluno.usuario.name}" foi suspenso`,
            description: 'O aluno atingiu o limite de faltas permitidas.'
          })
        }
      },
      onError: handleControleFaltaError
    }
  })

  const { mutateAsync: removerSuspensao, isPending: isRemovendoSuspensao } = useAlunosRemoverSuspensao({
    mutation: {
      onSuccess() {
        void queryClient.invalidateQueries({ queryKey: getAlunosGetAllQueryKey() })
        toaster.success({ title: `Suspensão do aluno "${aluno.usuario.name}" removida com sucesso` })
      },
      onError: handleRemoverSuspensaoError
    }
  })

  const handleDefinirFaltas = async (faltas: number) => {
    await definirFaltas({ id: aluno.id, data: { faltas } })
  }

  const handleRemoverSuspensao = async () => {
    if (somenteVisualizacao) return
    await removerSuspensao({ id: aluno.id })
  }

  return (
    <Center>
      {aluno.suspensoAte && isSuspenso(aluno) ? (
        <Tooltip content="Remover suspensão" positioning={{ placement: 'top' }} disabled={somenteVisualizacao}>
          <Button
            colorPalette="red"
            size="xs"
            h={10}
            onClick={handleRemoverSuspensao}
            loading={isRemovendoSuspensao}
            cursor={somenteVisualizacao ? 'default' : 'pointer'}
          >
            Suspenso até <br />
            {dayjs(aluno.suspensoAte).format('DD [de] MMM')}
          </Button>
        </Tooltip>
      ) : somenteVisualizacao ? (
        <Badge colorPalette={aluno.faltas === limite - 1 ? 'red' : aluno.faltas > 0 ? 'yellow' : 'green'}>
          {aluno.faltas} faltas
        </Badge>
      ) : (
        <ButtonGroup size="sm" variant="outline" attached cursor="pointer">
          <IconButton
            variant="outline"
            colorPalette="red"
            onClick={() => handleDefinirFaltas(aluno.faltas - 1)}
            disabled={isPending || aluno.faltas === 0}
          >
            <RiSubtractLine />
          </IconButton>

          <Button as="div" variant="outline" loading={isPending}>
            {aluno.faltas}
          </Button>

          <IconButton
            variant="outline"
            colorPalette="blue"
            onClick={() => handleDefinirFaltas(aluno.faltas + 1)}
            disabled={isPending || aluno.faltas >= limite}
          >
            <RiAddLine />
          </IconButton>
        </ButtonGroup>
      )}
    </Center>
  )
}

function handleControleFaltaError(error: unknown) {
  toastError(error, {
    title: 'Erro ao atualizar faltas do aluno'
  })
}

function handleRemoverSuspensaoError(error: unknown) {
  toastError(error, {
    title: 'Erro ao remover suspensão do aluno'
  })
}
