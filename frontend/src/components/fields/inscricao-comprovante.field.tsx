import { ChamadaAluno, CreateInscricaoDto } from '@/api/endpoints/api.schemas'
import { useAuth } from '@/contexts/auth'
import { DAYS } from '@/utils/date'
import { Collapsible } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { useFormContext, useWatch } from 'react-hook-form'
import { FileField } from './common/file.field'

export function InscricaoComprovanteField({ chamada }: { chamada: ChamadaAluno }) {
  const { control } = useFormContext<CreateInscricaoDto>()
  const temAulaContraturno = useWatch({ control, name: 'temAulaContraturno' })

  const { me } = useAuth()
  const temContraturnoTurma = me.turma?.diasContraturno.includes(DAYS[dayjs(chamada.data).day()])

  if (temContraturnoTurma) return null

  return (
    <Collapsible.Root unmountOnExit open={temAulaContraturno}>
      <Collapsible.Content>
        <FileField<CreateInscricaoDto>
          name="file"
          label="Faça upload do comprovante"
          required={temAulaContraturno && !temContraturnoTurma}
          accept={[
            'image/*',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ]}
          maxFileSize={10 * 1024 * 1024} // 10MB
          maxFiles={1}
          secondaryText=".pdf, .doc, .docx e imagens (jpg, png, webp, etc.) — até 10MB"
        />
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
