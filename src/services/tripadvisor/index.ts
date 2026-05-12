import z from 'zod/v4'

export {
  locationCategories,
  LocationCategoryEnum,
  type LocationCategory,
} from '@/services/tripadvisor/categories'

function readUseMockApiFlag(): unknown {
  if (typeof process !== 'undefined' && process.env.VITE_USE_MOCK_API != null) {
    return process.env.VITE_USE_MOCK_API
  }
  return import.meta.env.VITE_USE_MOCK_API
}

const useMockAPI = z.stringbool().default(true).parse(readUseMockApiFlag())

export const {
  getLocationsFn,
  getSingleLocationFn,
  getSingleLocationPhotoFn,
  getDefaultLocationFn,
} = useMockAPI
  ? await import('@/services/tripadvisor/__mocks__/api')
  : await import('@/services/tripadvisor/api')
