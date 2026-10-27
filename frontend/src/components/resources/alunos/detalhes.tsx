import { useAlunosGetDetalhes } from '@/api/endpoints/alunos'
import { ErrorComponent } from '@/components/error/error-component'
import { SkeletonCircle } from '@/components/ui/skeleton'
import { Tooltip } from '@/components/ui/tooltip'
import { formatTurma } from '@/utils/formatters'
import { Badge, Box, DataList, Flex, Heading, Link, Skeleton, Stack, Text, Wrap } from '@chakra-ui/react'
import dayjs from 'dayjs'
import parsePhoneNumber from 'libphonenumber-js'
import {
  RiDoorClosedLine,
  RiHome2Line,
  RiInformationLine,
  RiMailLine,
  RiPhoneLine,
  RiRestaurantLine,
  RiWheelchairLine
} from 'react-icons/ri'
import { UsuarioFoto } from '../usuarios/foto'

export function AlunoDetalhes({ alunoId }: { alunoId: string }) {
  const { data: aluno, isLoading, error } = useAlunosGetDetalhes(alunoId)

  if (error) return <ErrorComponent error={error} />
  if (!aluno || isLoading) return <Loading />

  const parsedPhoneNumber = parsePhoneNumber(aluno.usuario.phone || '', 'BR')
  const whatsappLink = parsedPhoneNumber && `https://wa.me/${parsedPhoneNumber.number.slice(1)}`

  return (
    <Box overflow="auto">
      <Flex gap={2} align="center">
        <UsuarioFoto usuario={aluno.usuario} />

        <Box flex={1}>
          <Heading textStyle="md" lineHeight="short">
            {aluno.usuario.name}
          </Heading>
          <Text textStyle="sm" lineHeight="short" color="fg.muted">
            {aluno.matricula}
          </Text>
        </Box>
      </Flex>

      <Wrap gap={2} my={2}>
        <Tooltip content="Aluno com Necessidades Educacionais Especiais" positioning={{ placement: 'top' }}>
          <Badge colorPalette="blue" hidden={!aluno.possuiNEE}>
            <RiWheelchairLine />
            NEE
          </Badge>
        </Tooltip>

        <Badge colorPalette="orange" hidden={!aluno.faltas}>
          {aluno.faltas} faltas
        </Badge>

        <Badge colorPalette="red" hidden={!aluno.suspensoAte}>
          Suspenso até {dayjs(aluno.suspensoAte).format('DD [de] MMMM')}
        </Badge>
      </Wrap>

      <Box>
        <DataList.Root orientation="horizontal" gap={2}>
          <DataList.Item>
            <DataList.ItemLabel minW={0} color="blue.solid">
              <Tooltip content="Cidade" positioning={{ placement: 'left' }}>
                <RiHome2Line size={16} />
              </Tooltip>
            </DataList.ItemLabel>

            <DataList.ItemValue display="block">
              {aluno.cidade} - {aluno.estado}
            </DataList.ItemValue>
          </DataList.Item>

          {aluno.turma && aluno.curso && (
            <DataList.Item>
              <DataList.ItemLabel minW={0} color="green.solid">
                <Tooltip content="Turma" positioning={{ placement: 'left' }}>
                  <RiDoorClosedLine size={16} />
                </Tooltip>
              </DataList.ItemLabel>

              <DataList.ItemValue display="block">{formatTurma(aluno.turma, aluno.curso)}</DataList.ItemValue>
            </DataList.Item>
          )}

          <DataList.Item>
            <DataList.ItemLabel minW={0} color="purple.solid">
              <Tooltip content="Refeições pedidas" positioning={{ placement: 'left' }}>
                <RiRestaurantLine size={16} />
              </Tooltip>
            </DataList.ItemLabel>

            <DataList.ItemValue display="block">{aluno.inscricoes} inscrições</DataList.ItemValue>
          </DataList.Item>

          <DataList.Item>
            <DataList.ItemLabel minW={0} color="red.solid">
              <Tooltip content="E-mail" positioning={{ placement: 'left' }}>
                <RiMailLine size={16} />
              </Tooltip>
            </DataList.ItemLabel>

            <DataList.ItemValue display="block">
              <Tooltip content="Enviar e-mail" positioning={{ placement: 'right' }}>
                <Link target="_blank" href={`mailto:${aluno.usuario.email}`}>
                  {aluno.usuario.email}
                </Link>
              </Tooltip>
            </DataList.ItemValue>
          </DataList.Item>

          <DataList.Item>
            <DataList.ItemLabel minW={0} color="green.solid">
              <Tooltip content="Telefone" positioning={{ placement: 'left' }}>
                <RiPhoneLine size={16} />
              </Tooltip>
            </DataList.ItemLabel>

            <DataList.ItemValue display="block" hidden={!aluno.usuario.phone}>
              <Tooltip content="Abrir WhatsApp" positioning={{ placement: 'right' }}>
                <Link target="_blank" href={whatsappLink} hidden={!whatsappLink}>
                  {aluno.usuario.phone}
                </Link>
              </Tooltip>

              <Tooltip content="Ligar" positioning={{ placement: 'right' }}>
                <Link target="_blank" href={`tel:${aluno.usuario.phone}`} hidden={!!whatsappLink}>
                  {aluno.usuario.phone}
                </Link>
              </Tooltip>
            </DataList.ItemValue>
          </DataList.Item>

          <DataList.Item hidden={!aluno.observacoes}>
            <DataList.ItemLabel minW={0} color="orange.solid">
              <Tooltip content="Observações" positioning={{ placement: 'left' }}>
                <RiInformationLine size={16} />
              </Tooltip>
            </DataList.ItemLabel>

            <DataList.ItemValue display="block" fontStyle="italic">
              {aluno.observacoes}
            </DataList.ItemValue>
          </DataList.Item>
        </DataList.Root>
      </Box>
    </Box>
  )
}

function Loading() {
  return (
    <Box overflow="auto">
      <Flex gap={2} align="center">
        <SkeletonCircle size={8} />

        <Box flex={1}>
          <Skeleton w={200} h={22} />
          <Skeleton w={100} h={19.25} />
        </Box>
      </Flex>

      <Stack gap={2} mt={4}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Box key={i}>
            <Flex align="center" gap={4}>
              <Skeleton w="16px" h="16px" />
              <Skeleton w={150} h="20px" />
            </Flex>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
