import { useAlunosGetQRCode } from '@/api/endpoints/alunos'
import iconeIFPB from '@/assets/img/icone-ifpb.png'
import { useAuth } from '@/contexts/auth'
import { Center, Stack, Text } from '@chakra-ui/react'
import { QRCodeCanvas } from 'qrcode.react'
import { ErrorComponent } from '@/components/error/error-component'
import { Skeleton } from '@/components/ui/skeleton'

export function AlunoQRCode() {
  const { data, isLoading, error, refetch } = useAlunosGetQRCode()
  const { me } = useAuth()

  if (isLoading) return <Skeleton mx="auto" w={320} h={394} />
  if (error) return <ErrorComponent error={error} retry={refetch} />

  const qrCodeData = [data?.version, data?.id, data?.signature]
  const qrCodeString = JSON.stringify(qrCodeData)

  return (
    <Center>
      <Stack bgColor="white" p={8} pt={6} borderRadius="md" boxShadow="md" textAlign="center">
        <Text textStyle="xl" fontWeight="bold">
          IFPB Meals
        </Text>
        <Text textStyle="sm" textTransform="uppercase" textAlign="center" fontWeight="medium" mb={4}>
          {me.user?.name}
        </Text>
        <QRCodeCanvas
          value={qrCodeString}
          size={256}
          imageSettings={{ src: iconeIFPB, width: 36, height: 36, excavate: true }}
        />
      </Stack>
    </Center>
  )
}
