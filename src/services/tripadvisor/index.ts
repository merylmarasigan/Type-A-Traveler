export const {
  getLocationsFn,
  getSingleLocationFn,
  getSingleLocationPhotoFn,
  LocationCategoryEnum,
} = import.meta.env.VITE_USE_MOCK_API
  ? await import('@/services/tripadvisor/__mocks__/api')
  : await import('@/services/tripadvisor/api')

export type { LocationCategory } from '@/services/tripadvisor/api'
