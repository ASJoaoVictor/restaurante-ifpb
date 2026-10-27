import { useBlocker } from '@/hooks/use-blocker'
import { LinkProps, useNavigate } from '@tanstack/react-router'
import { ReactNode } from 'react'
import { DefaultValues, FormProvider, useForm } from 'react-hook-form'
import { toastError } from '../../error/toast-error'
import { toaster } from '../../ui/toaster'
import { FormSubmitButton } from './submit-button'

type EntityBase = { id: string }

interface BaseFormProps<TEntity extends EntityBase> {
  edit?: TEntity
  createMutation: { mutateAsync: (params: { data: TEntity }) => Promise<unknown> }
  updateMutation: { mutateAsync: (params: { id: string; data: TEntity }) => Promise<unknown> }
  successRedirectPath: LinkProps['to']
  children: ReactNode
}

export function BaseForm<TEntity extends EntityBase>({
  edit,
  createMutation,
  updateMutation,
  successRedirectPath,
  children
}: BaseFormProps<TEntity>) {
  const navigate = useNavigate()

  const form = useForm<TEntity>({
    defaultValues: edit as DefaultValues<TEntity> | undefined
  })
  const { handleSubmit, formState } = form
  const { dirtyFields, isSubmitted, isSubmitting } = formState
  const isDirty = Object.keys(dirtyFields).length > 0

  useBlocker((isDirty && !isSubmitted) || isSubmitting)

  const onSubmit = async (data: TEntity) => {
    try {
      if (edit) {
        await updateMutation.mutateAsync({ id: edit.id, data })
        toaster.success({ title: 'Salvo com sucesso' })
      } else {
        await createMutation.mutateAsync({ data })
        toaster.success({ title: 'Salvo com sucesso' })
      }
      setTimeout(() => {
        void navigate({ to: successRedirectPath, replace: true })
      })
    } catch (error) {
      toastError(error)
    }
  }

  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        {children}
        <FormSubmitButton />
      </form>
    </FormProvider>
  )
}
