import { Chamada, CreateChamadaDto, Refeicao } from '@/api/endpoints/api.schemas'
import { useRefeicoesGetAll, useRefeicoesGetAllWithoutPagination } from '@/api/endpoints/refeicoes'
import { applyTimeToDate, nextWeekday, weekdayToInt } from '@/utils/date'
import { Button, For, Skeleton, VStack } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { useCallback, useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { ErrorComponent } from '../error/error-component'
import { HookField } from './common/hook-field'

export function RefeicaoField({ edit }: { edit?: Chamada }) {
  const { data: refeicoes, isLoading, error, refetch } = useRefeicoesGetAllWithoutPagination()
  const { handleSelectRefeicao } = useRefeicaoSelection(!!edit)

  if (isLoading) return <LoadingRefeicaos />
  if (error) return <ErrorComponent error={error} retry={refetch} />

  return (
    <HookField<CreateChamadaDto> name="refeicaoId" label="Refeição">
      {({ field, formState }) => (
        <VStack align="stretch" w="full" gap={1}>
          <Button
            variant={!field.value ? 'solid' : 'outline'}
            justifyContent="start"
            truncate
            onClick={() => field.onChange(null)}
            disabled={formState.isSubmitting}
          >
            (Nenhum)
          </Button>

          <For each={refeicoes}>
            {(item) => (
              <Button
                key={item.id}
                variant={field.value === item.id ? 'solid' : 'outline'}
                justifyContent="start"
                truncate
                onClick={() => handleSelectRefeicao(item.id)}
                disabled={formState.isSubmitting}
              >
                {item.nome}
              </Button>
            )}
          </For>
        </VStack>
      )}
    </HookField>
  )
}

function LoadingRefeicaos() {
  return (
    <VStack align="stretch" w="full" gap={1}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton height="40px" key={index} />
      ))}
    </VStack>
  )
}

function useRefeicaoSelection(isEditing: boolean) {
  const { data: refeicoes } = useRefeicoesGetAll({ page: 1, pageSize: 100 })
  const { control, getValues, setValue } = useFormContext<CreateChamadaDto>()
  const data = useWatch({ control, name: 'data' })
  const { calculateDatesFromRefeicao } = useRefeicaoCalculator()

  // Atualiza as datas de abertura, fechamento, etc. quando a data principal mudar
  useEffect(() => {
    if (isEditing) return

    const refeicaoId = getValues('refeicaoId')
    const dataRefeicao = getValues('data')

    if (!data || !refeicaoId || !dataRefeicao || !refeicoes?.items) return

    const refeicao = refeicoes.items.find((item) => item.id === refeicaoId)
    if (refeicao) {
      calculateDatesFromRefeicao(refeicao, dataRefeicao)
    }
  }, [calculateDatesFromRefeicao, data, getValues, refeicoes?.items, isEditing])

  // Atualiza os dados da chamada quando selecionar uma refeição
  const handleSelectRefeicao = useCallback(
    (refeicaoId: string | null) => {
      setValue('refeicaoId', refeicaoId)
      if (!refeicaoId || !refeicoes?.items) return
      if (isEditing) return

      const refeicao = refeicoes.items.find((item) => item.id === refeicaoId)
      if (!refeicao) return

      // Aplicar valores da refeição
      if (refeicao.nome) setValue('nome', refeicao.nome)
      if (refeicao.vagas) setValue('vagas', refeicao.vagas)
      if (refeicao.turno) setValue('turno', refeicao.turno)
      setValue('priorizarMesmoTurno', refeicao.priorizarMesmoTurno)
      setValue('aberturaAutomatica', refeicao.aberturaAutomatica)
      setValue('fechamentoAutomatico', refeicao.fechamentoAutomatico)
      setValue('divulgacaoAutomatica', refeicao.divulgacaoAutomatica)
      setValue('finalizacaoAutomatica', refeicao.finalizacaoAutomatica)
      setValue('encerramentoAutomatico', refeicao.encerramentoAutomatico)

      // Definir data baseada no dia da semana
      if (refeicao.diaDaSemana) {
        setValue('data', nextWeekday(weekdayToInt(refeicao.diaDaSemana)!).format('YYYY-MM-DD'))
      }

      // Calcular datas e horários
      const dataRefeicao = getValues('data')
      if (dataRefeicao) {
        calculateDatesFromRefeicao(refeicao, dataRefeicao)
      }
    },
    [calculateDatesFromRefeicao, getValues, refeicoes?.items, setValue, isEditing]
  )

  return { handleSelectRefeicao }
}

function useRefeicaoCalculator() {
  const { setValue } = useFormContext<CreateChamadaDto>()

  const calculateDatesFromRefeicao = useCallback(
    (refeicao: Refeicao, dataRefeicao: string) => {
      const baseDate = dayjs(dataRefeicao)

      const dates = {
        abertura: baseDate,
        fechamento: baseDate,
        divulgacao: baseDate,
        finalizacao: baseDate,
        encerramento: baseDate
      }

      // Calcular abertura
      if (refeicao.deslocamentoDataAbertura) {
        dates.abertura = dates.abertura.add(refeicao.deslocamentoDataAbertura, 'days')
      }
      if (refeicao.horarioAbertura) {
        dates.abertura = applyTimeToDate(dates.abertura, refeicao.horarioAbertura)
      }

      // Calcular fechamento
      if (refeicao.deslocamentoDataFechamento) {
        dates.fechamento = dates.fechamento.add(refeicao.deslocamentoDataFechamento, 'days')
      }
      if (refeicao.horarioFechamento) {
        dates.fechamento = applyTimeToDate(dates.fechamento, refeicao.horarioFechamento)
      }

      // Calcular divulgação
      if (refeicao.deslocamentoDataDivulgacao) {
        dates.divulgacao = dates.divulgacao.add(refeicao.deslocamentoDataDivulgacao, 'days')
      }
      if (refeicao.horarioDivulgacaoResultado) {
        dates.divulgacao = applyTimeToDate(dates.divulgacao, refeicao.horarioDivulgacaoResultado)
      }

      // Calcular finalização
      if (refeicao.deslocamentoDataFinalizacao) {
        dates.finalizacao = dates.finalizacao.add(refeicao.deslocamentoDataFinalizacao, 'days')
      }
      if (refeicao.horarioFinalizacao) {
        dates.finalizacao = applyTimeToDate(dates.finalizacao, refeicao.horarioFinalizacao)
      }

      // Calcular encerramento
      if (refeicao.deslocamentoDataEncerramento) {
        dates.encerramento = dates.encerramento.add(refeicao.deslocamentoDataEncerramento, 'days')
      }
      if (refeicao.horarioEncerramento) {
        dates.encerramento = applyTimeToDate(dates.encerramento, refeicao.horarioEncerramento)
      }

      // Aplicar valores calculados
      const dateTimeFormat = 'YYYY-MM-DDTHH:mm'
      setValue('dataHoraAbertura', dates.abertura.format(dateTimeFormat))
      setValue('dataHoraFechamento', dates.fechamento.format(dateTimeFormat))
      setValue('dataHoraDivulgacaoResultado', dates.divulgacao.format(dateTimeFormat))
      setValue('dataHoraFinalizacao', dates.finalizacao.format(dateTimeFormat))
      setValue('dataHoraEncerramento', dates.encerramento.format(dateTimeFormat))
    },
    [setValue]
  )

  return { calculateDatesFromRefeicao }
}
