import { ChamadaComTotalInscritosDto } from '@/api/endpoints/api.schemas'
import { OrvalPaginatedGetQueryKey, OrvalPaginatedQuery, OrvalRemoveQuery } from '@/types/api'
import { createColumnHelper } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { getActionsColumn } from '../data-table/columns/actions'
import { getCreatedAtColumn, getUpdatedAtColumn } from '../data-table/columns/created-updated'
import { getSelectColumn } from '../data-table/columns/select'
import { DefaultHeader } from '../data-table/headers/default-header'
import { ChamadaDataHoraStatusDisplay } from '../displays/chamada-data-hora-status.display'
import { ChamadaStatusDisplay } from '../displays/chamada-status.display'
import { ChamadaTurnoDisplay } from '../displays/chamada-turno.display'

export const columnHelper = createColumnHelper<ChamadaComTotalInscritosDto>()

export const columnsChamadas =
  (isGestor: boolean) =>
  (
    listHook: OrvalPaginatedQuery<ChamadaComTotalInscritosDto>,
    removeHook: OrvalRemoveQuery<ChamadaComTotalInscritosDto>,
    getQueryKey: OrvalPaginatedGetQueryKey
  ) => [
    ...(isGestor
      ? [
          getSelectColumn(columnHelper),

          getActionsColumn(columnHelper, {
            link: '/admin/chamadas/editar/$id',
            removeHook,
            getQueryKey
          })
        ]
      : []),

    columnHelper.accessor('nome', {
      header: (info) => <DefaultHeader<ChamadaComTotalInscritosDto> info={info} name="Nome" />,
      cell: (i) => i.getValue()
    }),

    columnHelper.accessor('data', {
      header: (info) => <DefaultHeader<ChamadaComTotalInscritosDto> info={info} name="Data" />,
      cell: (i) => dayjs(i.getValue()).format('DD [de] MMM')
    }),

    columnHelper.accessor('status', {
      header: (info) => <DefaultHeader<ChamadaComTotalInscritosDto> info={info} name="Status" />,
      cell: (i) => <ChamadaStatusDisplay chamada={i.row.original} />
    }),

    columnHelper.accessor('vagas', {
      header: (info) => <DefaultHeader<ChamadaComTotalInscritosDto> info={info} name="Vagas" />,
      cell: (i) => i.getValue() ?? '∞',
      size: 0
    }),

    columnHelper.accessor('totalInscritos', {
      header: (info) => <DefaultHeader<ChamadaComTotalInscritosDto> info={info} name="Total Inscritos" />,
      cell: (i) => i.getValue() ?? 0,
      size: 0
    }),

    columnHelper.accessor('dataHoraAbertura', {
      header: (info) => <DefaultHeader<ChamadaComTotalInscritosDto> info={info} name="Abertura" />,
      cell: (i) => (
        <ChamadaDataHoraStatusDisplay
          dataHoraPrevista={i.row.original.dataHoraAbertura}
          dataHoraReal={i.row.original.dataHoraAberturaReal}
          automatico={i.row.original.aberturaAutomatica}
        />
      ),
      size: 0
    }),

    columnHelper.accessor('dataHoraFechamento', {
      header: (info) => <DefaultHeader<ChamadaComTotalInscritosDto> info={info} name="Fechamento" />,
      cell: (i) => (
        <ChamadaDataHoraStatusDisplay
          dataHoraPrevista={i.row.original.dataHoraFechamento}
          dataHoraReal={i.row.original.dataHoraFechamentoReal}
          automatico={i.row.original.fechamentoAutomatico}
        />
      ),
      size: 0
    }),

    columnHelper.accessor('dataHoraDivulgacaoResultado', {
      header: (info) => <DefaultHeader<ChamadaComTotalInscritosDto> info={info} name="Divulgação" />,
      cell: (i) => (
        <ChamadaDataHoraStatusDisplay
          dataHoraPrevista={i.row.original.dataHoraDivulgacaoResultado}
          dataHoraReal={i.row.original.dataHoraDivulgacaoResultadoReal}
          automatico={i.row.original.divulgacaoAutomatica}
        />
      ),
      size: 0
    }),

    columnHelper.accessor('dataHoraFinalizacao', {
      header: (info) => <DefaultHeader<ChamadaComTotalInscritosDto> info={info} name="Finalização" />,
      cell: (i) => (
        <ChamadaDataHoraStatusDisplay
          dataHoraPrevista={i.row.original.dataHoraFinalizacao}
          dataHoraReal={i.row.original.dataHoraFinalizacaoReal}
          automatico={i.row.original.finalizacaoAutomatica}
        />
      ),
      size: 0
    }),

    columnHelper.accessor('dataHoraEncerramento', {
      header: (info) => <DefaultHeader<ChamadaComTotalInscritosDto> info={info} name="Encerramento" />,
      cell: (i) => (
        <ChamadaDataHoraStatusDisplay
          dataHoraPrevista={i.row.original.dataHoraEncerramento}
          dataHoraReal={i.row.original.dataHoraEncerramentoReal}
          automatico={i.row.original.encerramentoAutomatico}
        />
      ),
      size: 0
    }),

    columnHelper.accessor('turno', {
      header: (info) => <DefaultHeader<ChamadaComTotalInscritosDto> info={info} name="Turno" />,
      cell: (i) => <ChamadaTurnoDisplay chamada={i.row.original} />,
      size: 0
    }),

    getCreatedAtColumn(columnHelper),

    getUpdatedAtColumn(columnHelper)
  ]
