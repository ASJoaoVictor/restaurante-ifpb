import { ChamadaComInscricoes, ChamadasGerarPdfInscricoesParams } from '@/api/endpoints/api.schemas'
import { api } from '@/api'
import { Button, ButtonGroup, IconButton, Link, Menu, Portal } from '@chakra-ui/react'
import { LuChevronDown, LuChevronRight } from 'react-icons/lu'
import { RiPrinterLine } from 'react-icons/ri'

function getImprimirUrl(chamadaId: string, params: ChamadasGerarPdfInscricoesParams = {}) {
  return api.getUri({
    url: `/api/chamadas/${encodeURIComponent(chamadaId)}/inscricoes/pdf`,
    params: { orderBy: 'alfabetica', ...params }
  })
}

export function ChamadaImprimirActions({ chamada }: { chamada: ChamadaComInscricoes }) {
  return (
    <ButtonGroup attached variant="subtle" colorPalette="yellow">
      <Button asChild>
        <Link href={getImprimirUrl(chamada.chamada.id)} rel="noopener noreferrer" target="_blank" unstyled>
          <RiPrinterLine />
          Imprimir
        </Link>
      </Button>

      <Menu.Root lazyMount>
        <Menu.Trigger asChild>
          <IconButton aria-label="Opções de impressão" roundedStart={0}>
            <LuChevronDown />
          </IconButton>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Root positioning={{ placement: 'left-start', gutter: 2 }}>
                <Menu.TriggerItem>
                  <RiPrinterLine />
                  Alunos contemplados
                  <LuChevronRight style={{ marginLeft: 'auto' }} />
                </Menu.TriggerItem>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Menu.Item asChild value="contemplados-alfabetica">
                        <Link
                          href={getImprimirUrl(chamada.chamada.id)}
                          rel="noopener noreferrer"
                          target="_blank"
                          unstyled
                        >
                          Ordem alfabética
                        </Link>
                      </Menu.Item>
                      <Menu.Item asChild value="contemplados-prioridade">
                        <Link
                          href={getImprimirUrl(chamada.chamada.id, { orderBy: 'prioridade' })}
                          rel="noopener noreferrer"
                          target="_blank"
                          unstyled
                        >
                          Ordem de prioridade
                        </Link>
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>

              <Menu.Root positioning={{ placement: 'left-start', gutter: 2 }}>
                <Menu.TriggerItem>
                  <RiPrinterLine />
                  Todos os alunos
                  <LuChevronRight style={{ marginLeft: 'auto' }} />
                </Menu.TriggerItem>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Menu.Item asChild value="todos-alfabetica">
                        <Link
                          href={getImprimirUrl(chamada.chamada.id, { todos: true })}
                          rel="noopener noreferrer"
                          target="_blank"
                          unstyled
                        >
                          Ordem alfabética
                        </Link>
                      </Menu.Item>
                      <Menu.Item asChild value="todos-prioridade">
                        <Link
                          href={getImprimirUrl(chamada.chamada.id, { todos: true, orderBy: 'prioridade' })}
                          rel="noopener noreferrer"
                          target="_blank"
                          unstyled
                        >
                          Ordem de prioridade
                        </Link>
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>

              <Menu.Root positioning={{ placement: 'left-start', gutter: 2 }}>
                <Menu.TriggerItem>
                  <RiPrinterLine />
                  Alunos selecionados
                  <LuChevronRight style={{ marginLeft: 'auto' }} />
                </Menu.TriggerItem>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Menu.Item value="selecionados-alfabetica" disabled>
                        Ordem alfabética
                      </Menu.Item>
                      <Menu.Item value="selecionados-prioridade" disabled>
                        Ordem de prioridade
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>

              <Menu.Item asChild value="presentes">
                <Link
                  href={getImprimirUrl(chamada.chamada.id, { filter: 'presentes' })}
                  rel="noopener noreferrer"
                  target="_blank"
                  unstyled
                >
                  <RiPrinterLine />
                  Alunos presentes
                </Link>
              </Menu.Item>

              <Menu.Item asChild value="ausentes">
                <Link
                  href={getImprimirUrl(chamada.chamada.id, { filter: 'ausentes' })}
                  rel="noopener noreferrer"
                  target="_blank"
                  unstyled
                >
                  <RiPrinterLine />
                  Alunos ausentes
                </Link>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </ButtonGroup>
  )
}

export function ChamadaImprimirPresenca({ chamadaId }: { chamadaId: string; chamadaNome: string }) {
  return (
    <Menu.Root lazyMount>
      <Menu.Trigger asChild>
        <Button variant="subtle" colorPalette="yellow">
          <RiPrinterLine />
          Imprimir
          <LuChevronDown />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item asChild value="presentes">
              <Link
                href={getImprimirUrl(chamadaId, { filter: 'presentes' })}
                rel="noopener noreferrer"
                target="_blank"
                unstyled
              >
                <RiPrinterLine />
                Alunos presentes
              </Link>
            </Menu.Item>
            <Menu.Item asChild value="ausentes">
              <Link
                href={getImprimirUrl(chamadaId, { filter: 'ausentes' })}
                rel="noopener noreferrer"
                target="_blank"
                unstyled
              >
                <RiPrinterLine />
                Alunos ausentes
              </Link>
            </Menu.Item>
            <Menu.Item asChild value="desistentes">
              <Link
                href={getImprimirUrl(chamadaId, { filter: 'desistentes' })}
                rel="noopener noreferrer"
                target="_blank"
                unstyled
              >
                <RiPrinterLine />
                Alunos desistentes
              </Link>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
