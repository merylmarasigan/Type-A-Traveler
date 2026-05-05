import z from 'zod/v4'

const useMockAPI = z
  .stringbool()
  .default(true)
  .parse(import.meta.env.VITE_USE_MOCK_API)

export const {
  getLocationsFn,
  getSingleLocationFn,
  getSingleLocationPhotoFn,
  LocationCategoryEnum,
} = useMockAPI
  ? await import('@/services/tripadvisor/__mocks__/api')
  : await import('@/services/tripadvisor/api')

export type { LocationCategory } from '@/services/tripadvisor/api'
