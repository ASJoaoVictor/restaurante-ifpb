'use client'

import { Toaster as ChakraToaster, Portal, Spinner, Stack, Toast, createToaster } from '@chakra-ui/react'

export const toasterTop = createToaster({
  placement: 'top',
  pauseOnPageIdle: true,
  overlap: true
})

export function ToasterTop() {
  return (
    <Portal>
      <ChakraToaster toaster={toasterTop} insetInline={{ mdDown: '4' }}>
        {(toast) => (
          <Toast.Root
            width={{ md: 'sm' }}
            maxH="sm"
            overflow="auto"
            scrollbarColor="var(--chakra-colors-color-palette-contrast) transparent"
            css={{
              '& [data-ghost="before"]': { scale: '1 !important' }
            }}
          >
            {toast.type === 'loading' ? <Spinner size="sm" color="blue.solid" /> : <Toast.Indicator />}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && <Toast.Description whiteSpace="pre-line">{toast.description}</Toast.Description>}
            </Stack>
            {toast.action && <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>}
            {toast.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}
