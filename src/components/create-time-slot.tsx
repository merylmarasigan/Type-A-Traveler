import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ItineraryDay } from '@/db/types'
import { useTimeSlots } from '@/hooks/use-time-slots'
import { useForm } from '@tanstack/react-form'
import { addHours, format, setHours, setMinutes } from 'date-fns'
import { ClockCheck, ClockPlus } from 'lucide-react'
import { useState } from 'react'
import z from 'zod/v4'

interface CreateTimeSlotProps {
  itineraryDay: ItineraryDay
}

const formSchema = z.object({
  startTime: z.date(),
  endTime: z.date(),
})

export function CreateTimeSlot({ itineraryDay }: CreateTimeSlotProps) {
  const [open, setOpen] = useState(false)

  const { createTimeSlotMutation } = useTimeSlots(itineraryDay.id)

  const form = useForm({
    defaultValues: {
      startTime: new Date(),
      endTime: addHours(new Date(), 1),
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await createTimeSlotMutation.mutateAsync({
        itineraryDayId: itineraryDay.id,
        ...value,
      })
    },
  })

  const updateTime = (originalDate: Date, hour: number, minute: number) => {
    let updatedDate = setHours(originalDate, hour)
    updatedDate = setMinutes(updatedDate, minute)

    return updatedDate
  }

  return (
    <form
      id="create-time-slot-form"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="justify-between">
            <ClockPlus />
            Add time slot
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-4">
          <FieldGroup className="flex flex-row gap-4">
            <form.Field
              name="startTime"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Start Time</FieldLabel>
                    <Input
                      type="time"
                      required
                      id={field.name}
                      name={field.name}
                      value={format(field.state.value, 'HH:mm')}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value
                          .split(':')
                          .map(Number)
                        field.handleChange(
                          updateTime(field.state.value, hours, minutes),
                        )
                      }}
                      aria-invalid={isInvalid}
                      className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="endTime"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>End Time</FieldLabel>
                    <Input
                      type="time"
                      required={false}
                      id={field.name}
                      name={field.name}
                      value={format(field.state.value, 'HH:mm')}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value
                          .split(':')
                          .map(Number)
                        field.handleChange(
                          updateTime(field.state.value, hours, minutes),
                        )
                      }}
                      aria-invalid={isInvalid}
                      className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>

          <Button
            form="create-time-slot-form"
            type="submit"
            className="self-center justify-between"
          >
            <ClockCheck />
            Save
          </Button>
        </PopoverContent>
      </Popover>
    </form>
  )
}
