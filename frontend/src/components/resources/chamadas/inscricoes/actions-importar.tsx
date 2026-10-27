import { ChamadaComInscricoes } from '@/api/endpoints/api.schemas'
import { ImportarInscricoesForm } from '@/components/forms/importar-inscricoes'
import { ImportarInscricoesSuapForm } from '@/components/forms/importar-inscricoes-suap'
import { Button, Menu, Portal } from '@chakra-ui/react'
import { LuChevronDown } from 'react-icons/lu'
import { RiImportLine } from 'react-icons/ri'

export function ChamadaImportarActions({ chamada }: { chamada: ChamadaComInscricoes }) {
  return (
    <Menu.Root lazyMount closeOnSelect={false}>
      <Menu.Trigger asChild>
        <Button variant="subtle" colorPalette="gray">
          <RiImportLine />
          Importar
          <LuChevronDown />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <ImportarInscricoesSuapForm chamada={chamada.chamada}>
              <Menu.Item value="suap">Importar do SUAP</Menu.Item>
            </ImportarInscricoesSuapForm>
            <ImportarInscricoesForm chamada={chamada.chamada}>
              <Menu.Item value="planilha">Importar de planilha</Menu.Item>
            </ImportarInscricoesForm>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
