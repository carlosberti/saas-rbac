import { type FormEvent, useState, useTransition } from 'react'

type FormState<T = Record<string, string[]> | null> = {
  success: boolean
  message: string | null
  errors: T
}

export function useFormState<T>(
  action: (data: FormData) => Promise<FormState>,
  onSuccess?: (form: HTMLFormElement) => Promise<void> | void,
  initialState?: FormState<T>,
) {
  // const [{ success, message, errors }, formAction, isPending] = useActionState(
  //   signInWithEmailAndPassword,
  //   {
  //     success: false,
  //     message: null,
  //     errors: null,
  //   },
  // ) use useActionState once react give us a solution to do not reset the form state on submit. Once that is available, use action prop on the form instead of onSubmit
  const [formState, setFormState] = useState(
    initialState ?? {
      success: false,
      message: null,
      errors: null,
    },
  )
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event?.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)

    startTransition(async () => {
      const state = await action(data)

      if (state.success && onSuccess) {
        await onSuccess(form)
      }

      setFormState(state as FormState<T>)
    })
  }

  return [formState, handleSubmit, isPending] as const
}
