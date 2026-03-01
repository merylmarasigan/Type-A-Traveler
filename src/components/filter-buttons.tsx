import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function FilterButtons() {
  return (
    <RadioGroup defaultValue="hotels" className="grid-flow-col">
      <FieldLabel htmlFor="hotels">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Hotels</FieldTitle>
          </FieldContent>
          <RadioGroupItem value="hotels" id="hotels" className="sr-only"/>
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="attractions">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Attractions</FieldTitle>
          </FieldContent>
          <RadioGroupItem value="attractions" id="attractions" className="sr-only"/>
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="restaurants">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Restaurants</FieldTitle>
          </FieldContent>
          <RadioGroupItem value="restaurants" id="restaurants" className="sr-only"/>
        </Field>
      </FieldLabel>
    </RadioGroup>
  )
}
