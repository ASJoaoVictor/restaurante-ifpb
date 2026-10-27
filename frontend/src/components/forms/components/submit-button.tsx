import { Button, Center } from '@chakra-ui/react'
import { useFormContext } from 'react-hook-form'
import { RiSaveLine } from 'react-icons/ri'

export function FormSubmitButton() {
  const { formState } = useFormContext()
  const { isSubmitting } = formState

  return (
    <Center>
      <Button
        mt={8}
        size="xl"
        colorPalette="blue"
        position={{ base: 'fixed', md: 'static' }}
        bottom={4}
        right={4}
        type="submit"
        loading={isSubmitting}
        loadingText="Salvando..."
      >
        <RiSaveLine />
        Salvar
      </Button>
    </Center>
  )
}
