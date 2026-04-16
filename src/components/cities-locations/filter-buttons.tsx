import type { LocationCategory } from '@/services/tripadvisor/api'
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  LocationCategoryEnum,
  locationCategories,
} from '@/services/tripadvisor/api'

type Props = {
  currentCategory: LocationCategory
  setCurrentCategory: (value: LocationCategory) => void
}

export function FilterButtons({ currentCategory, setCurrentCategory }: Props) {
  const validateCategory = (value: string) => {
    const validatedCategory = LocationCategoryEnum.parse(value)
    setCurrentCategory(validatedCategory)
  }

  return (
    <RadioGroup
      value={currentCategory}
      className="grid-flow-row md:grid-flow-col w-full md:w-min"
      onValueChange={validateCategory}
    >
      {locationCategories.map((category) => (
        <FieldLabel key={category} htmlFor={category}>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>
                {category[0].toUpperCase() + category.substring(1)}
              </FieldTitle>
            </FieldContent>
            <RadioGroupItem
              value={category}
              id={category}
              className="sr-only"
            />
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  )
}
