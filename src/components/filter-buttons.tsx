import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  LocationCategory,
  LocationCategoryEnum,
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
      <FieldLabel htmlFor="hotels">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Hotels</FieldTitle>
          </FieldContent>
          <RadioGroupItem value="hotels" id="hotels" className="sr-only" />
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="attractions">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Attractions</FieldTitle>
          </FieldContent>
          <RadioGroupItem
            value="attractions"
            id="attractions"
            className="sr-only"
          />
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="restaurants">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Restaurants</FieldTitle>
          </FieldContent>
          <RadioGroupItem
            value="restaurants"
            id="restaurants"
            className="sr-only"
          />
        </Field>
      </FieldLabel>
    </RadioGroup>
  )
}
