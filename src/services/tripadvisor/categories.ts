import z from 'zod/v4'

export const locationCategories = [
  'hotels',
  'attractions',
  'restaurants',
] as const
export const LocationCategoryEnum = z.enum(locationCategories)
export type LocationCategory = z.infer<typeof LocationCategoryEnum>
