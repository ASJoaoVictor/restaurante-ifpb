import { useAlunosGetPreferenciasNotificacoes } from '@/api/endpoints/alunos'
import { CreatePreferenciaNotificacaoDto, RefeicaoAluno } from '@/api/endpoints/api.schemas'
import { Button, ButtonGroup, IconButton, Table } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { RiCloseLine, RiMailLine, RiWhatsappLine } from 'react-icons/ri'
import { ErrorComponent } from '../error/error-component'
import { Skeleton } from '../ui/skeleton'
import { Tooltip } from '../ui/tooltip'

export function NotificationsSetup() {
  const { data, isLoading, error, refetch } = useAlunosGetPreferenciasNotificacoes()

  const { setValue } = useFormContext<CreatePreferenciaNotificacaoDto>()

  useEffect(() => {
    if (!data) return
    const outrasRefeicoesPreferencia = data.preferencias.find(({ refeicaoId }) => refeicaoId === null)
    const outraRefeicaoPadrao = { refeicaoId: null, porEmail: true, porWhatsApp: true }
    const outraRefeicao = outrasRefeicoesPreferencia || outraRefeicaoPadrao

    setValue('notificacoes', [
      ...data?.refeicoes.map((refeicao) => {
        const preferencia = data.preferencias.find((p) => p.refeicaoId === refeicao.id)
        return {
          refeicaoId: refeicao.id,
          porEmail: preferencia ? preferencia.porEmail : true,
          porWhatsApp: preferencia ? preferencia.porWhatsApp : true
        }
      }),

      outraRefeicao
    ])
  }, [data, setValue])

  return (
    <>
      {isLoading && <Skeleton h="xs" />}
      {error && <ErrorComponent error={error} retry={refetch} />}

      {data && (
        <Table.Root size="sm">
          <Table.Body>
            {data.refeicoes.map((refeicao, index) => (
              <RefeicaoNotificacao key={refeicao.id} refeicao={refeicao} index={index} />
            ))}
            <RefeicaoNotificacao refeicao={null} index={data.refeicoes.length} />
          </Table.Body>
        </Table.Root>
      )}
    </>
  )
}

export function RefeicaoNotificacao({ refeicao, index }: { refeicao: RefeicaoAluno | null; index: number }) {
  const { control, setValue } = useFormContext<CreatePreferenciaNotificacaoDto>()
  const preferenciaNotificacao = useWatch({ control, name: `notificacoes.${index}` })

  if (!preferenciaNotificacao) return null

  const { porEmail, porWhatsApp } = preferenciaNotificacao
  const semNotificacao = !porEmail && !porWhatsApp

  return (
    <Table.Row>
      <Table.Cell border={0} pl={0} fontWeight="medium">
        {refeicao?.nome || <i>Outras refeições</i>}
      </Table.Cell>

      <Table.Cell border={0}>
        <ButtonGroup size="xs" variant="outline" attached>
          <Tooltip content="Não receber notificações" positioning={{ placement: 'top' }}>
            <IconButton
              aria-label="Não receber notificações"
              borderEndRadius={0}
              variant={semNotificacao ? 'solid' : 'outline'}
              colorPalette="teal"
              onClick={() => {
                setValue(`notificacoes.${index}.porEmail`, false)
                setValue(`notificacoes.${index}.porWhatsApp`, false)
              }}
            >
              <RiCloseLine />
            </IconButton>
          </Tooltip>
          <Button
            variant={porEmail ? 'solid' : 'outline'}
            colorPalette="orange"
            onClick={() => setValue(`notificacoes.${index}.porEmail`, !porEmail)}
          >
            <RiMailLine />
            E-mail
          </Button>
          <Button
            variant={porWhatsApp ? 'solid' : 'outline'}
            colorPalette="green"
            onClick={() => setValue(`notificacoes.${index}.porWhatsApp`, !porWhatsApp)}
          >
            <RiWhatsappLine />
            WhatsApp
          </Button>
        </ButtonGroup>
      </Table.Cell>
    </Table.Row>
  )
}
