import { getUploadUrl } from '@/api'
import { InscricaoComAluno } from '@/api/endpoints/api.schemas'
import { getChamadasGetOneWithInscricoesQueryKey } from '@/api/endpoints/chamadas'
import { useInscricoesAvaliarDocumentoComprobatorio } from '@/api/endpoints/inscricoes'
import { toastError } from '@/components/error/toast-error'
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { toaster } from '@/components/ui/toaster'
import { Button, Editable, Heading, IconButton, Link, chakra } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { memo, useState } from 'react'
import {
  RiCheckLine,
  RiCloseLargeFill,
  RiExternalLinkLine,
  RiFileCheckLine,
  RiFileCloseLine,
  RiFileLine,
  RiPencilLine
} from 'react-icons/ri'

export const InscricaoDocumentoDisplay = memo(InscricaoDocumentoDisplayMemo)

const status = {
  aceito: ['Comprovante aceito', RiFileCheckLine, 'green', 'solid'],
  rejeitado: ['Comprovante rejeitado', RiFileCloseLine, 'red', 'solid'],
  pendente: ['Comprovante pendente', RiFileLine, 'yellow', 'outline']
} as const

function InscricaoDocumentoDisplayMemo({ inscricaoComAluno }: { inscricaoComAluno: InscricaoComAluno }) {
  const { inscricao } = inscricaoComAluno
  const [open, setOpen] = useState(false)
  const [justificativa, setJustificativa] = useState('')
  const queryClient = useQueryClient()
  const queryKey = getChamadasGetOneWithInscricoesQueryKey(inscricao.chamadaId)

  const { mutateAsync: avaliarDocumento, isPending } = useInscricoesAvaliarDocumentoComprobatorio({
    mutation: {
      onSuccess() {
        setOpen(false)
        toaster.success({
          title: 'Avaliação realizada',
          description: 'A avaliação do documento foi realizada com sucesso.'
        })
        void queryClient.invalidateQueries({ queryKey })
      },
      onError: toastError
    }
  })

  if (!inscricao.documentoComprobatorio) return null

  const [label, Icon, color, variant] = status[inscricao.comprovanteContraturnoStatus]

  const handleRejeitar = async () => {
    await avaliarDocumento({
      id: inscricao.id,
      data: {
        comprovanteContraturnoStatus: 'rejeitado',
        justificativaRejeicaoComprovanteContraturno: justificativa || null
      }
    })
  }

  const handleAprovar = async () => {
    await avaliarDocumento({
      id: inscricao.id,
      data: {
        comprovanteContraturnoStatus: 'aceito',
        justificativaRejeicaoComprovanteContraturno: justificativa || null
      }
    })
  }

  return (
    <DialogRoot size="xl" scrollBehavior="inside" lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <IconButton aria-label={label} variant={variant} colorPalette={color}>
          <Icon />
        </IconButton>
      </DialogTrigger>

      {/* BUG: DialogContent só é renderizado quando open é true por causa de um bug na animação */}
      {open && (
        <DialogContent>
          <DialogCloseTrigger />

          <DialogHeader>
            <DialogTitle>Comprovante de aula no contraturno</DialogTitle>
          </DialogHeader>

          <DialogBody>
            <chakra.iframe
              src={getUploadUrl(inscricao.documentoComprobatorio)}
              title="Comprovante de aula no contraturno"
              w="full"
              h="sm"
            />
            <Button asChild size="sm" mt={2}>
              <Link href={getUploadUrl(inscricao.documentoComprobatorio)} target="_blank">
                <RiExternalLinkLine />
                Abrir em nova guia
              </Link>
            </Button>

            <Heading mt={4}>Justificativa de rejeição</Heading>
            <Editable.Root
              mt={2}
              defaultValue={inscricao.justificativaRejeicaoComprovanteContraturno || ''}
              value={justificativa}
              onValueChange={(e) => setJustificativa(e.value)}
            >
              <Editable.Preview />
              <Editable.Textarea rows={3} />
              <Editable.Control>
                <Editable.EditTrigger asChild>
                  <IconButton variant="ghost" size="xs">
                    <RiPencilLine />
                  </IconButton>
                </Editable.EditTrigger>
                <Editable.CancelTrigger asChild>
                  <IconButton variant="outline" size="xs">
                    <RiCloseLargeFill />
                  </IconButton>
                </Editable.CancelTrigger>
                <Editable.SubmitTrigger asChild>
                  <IconButton variant="outline" size="xs">
                    <RiCheckLine />
                  </IconButton>
                </Editable.SubmitTrigger>
              </Editable.Control>
            </Editable.Root>
          </DialogBody>

          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogActionTrigger>
            <Button
              loading={isPending}
              loadingText="Aguarde..."
              variant="outline"
              colorPalette="red"
              onClick={handleRejeitar}
            >
              Rejeitar
            </Button>
            <Button loading={isPending} loadingText="Aguarde..." colorPalette="green" onClick={handleAprovar}>
              Aceitar
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </DialogRoot>
  )
}
