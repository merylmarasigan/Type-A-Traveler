import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useRouter } from '@tanstack/react-router'
import { SubmitEvent, useRef } from 'react'

export function SearchCities() {
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const searchForCities = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!inputRef.current) return
    if (inputRef.current.value === '') return

    router.navigate({ to: `/search?city=${inputRef.current.value}` })
  }

  return (
    <>
      <form
        onSubmit={searchForCities}
        className="w-96 flex items-center justify-between gap-2 md:gap-4"
      >
        <Field>
          <Input
            id="near"
            placeholder="Los Angeles, New York, etc."
            ref={inputRef}
            className="w-full"
          />
        </Field>

        <Button type="submit">Search</Button>
      </form>
    </>
  )
}
