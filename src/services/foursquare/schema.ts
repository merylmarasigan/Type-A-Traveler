// ─── Shared primitives ────────────────────────────────────────────────────────

export interface FsqTipLegacy {
  id: string
  created_at: string
  text: string
  url: string
  lang: string
  agree_count: number
  disagree_count: number
}

export interface FsqPhotoLegacy {
  id: string
  created_at: string
  prefix: string
  suffix: string
  width: number
  height: number
  classifications?: string[]
  tip?: FsqTipLegacy
}

export interface FsqTip {
  fsq_tip_id: string
  created_at: string
  text: string
  url: string
  photo?: FsqPhotoLegacy
  lang: string
  agree_count: number
  disagree_count: number
}

export interface FsqPhoto {
  fsq_photo_id: string
  created_at: string
  prefix: string
  suffix: string
  width: number
  height: number
  classifications?: string[]
  tip?: FsqTip
}

export interface FsqCategoryIcon {
  id: string
  created_at: string
  prefix: string
  suffix: string
  width: number
  height: number
  classifications?: string[]
  tip?: FsqTipLegacy
}

export interface FsqCategory {
  fsq_category_id: string
  name: string
  short_name: string
  plural_name: string
  icon?: FsqCategoryIcon
}

export interface FsqChain {
  fsq_chain_id: string
  name: string
  logo?: FsqCategoryIcon // same shape as icon
  parent_id?: string
}

export interface FsqHoursPeriod {
  day: number // 1 = Monday … 7 = Sunday
  open: string
  close: string
}

export interface FsqHours {
  display?: string
  is_local_holiday?: boolean
  open_now?: boolean
  regular?: FsqHoursPeriod[]
}

export interface FsqLocation {
  address?: string
  locality?: string
  region?: string
  postcode?: string
  admin_region?: string
  post_town?: string
  po_box?: string
  country?: string
  formatted_address?: string
}

export interface FsqExtendedLocation {
  dma?: string
  census_block_id?: string
}

type FeatureFlag = Record<string, any> // returned as {} in the API

export interface FsqAttributes {
  restroom?: FeatureFlag
  outdoor_seating?: FeatureFlag
  atm?: FeatureFlag
  has_parking?: FeatureFlag
  wifi?: string
  delivery?: FeatureFlag
  reservations?: FeatureFlag
  takes_credit_card?: FeatureFlag
}

export interface FsqSocialMedia {
  facebook_id?: string
  instagram?: string
  twitter?: string
}

export interface FsqStats {
  total_photos?: number
  total_ratings?: number
  total_tips?: number
}

export interface FsqPlaceAction {
  action: string
  url: string
  provider_id: string
}

// ─── Related place (slightly different photo shape, no fsq_photo_id) ──────────

export interface FsqRelatedPlace {
  fsq_place_id: string
  latitude?: number
  longitude?: number
  categories?: FsqCategory[]
  chains?: FsqChain[]
  date_closed?: string
  date_created?: string
  date_refreshed?: string
  description?: string
  distance?: number
  email?: string
  extended_location?: FsqExtendedLocation
  attributes?: FsqAttributes
  hours?: FsqHours
  hours_popular?: FsqHoursPeriod[]
  link?: string
  location?: FsqLocation
  menu?: string
  name?: string
  photos?: FsqPhotoLegacy[]
  place_actions?: FsqPlaceAction[]
  popularity?: number
  placemaker_url?: string
  price?: number
  rating?: number
  social_media?: FsqSocialMedia
  stats?: FsqStats
  store_id?: string
  tastes?: string[]
  tel?: string
  tips?: FsqTipLegacy[]
  verified?: boolean
  website?: string
}

// ─── Top-level place ──────────────────────────────────────────────────────────

export interface FsqPlace {
  fsq_place_id: string
  latitude?: number
  longitude?: number
  categories?: FsqCategory[]
  chains?: FsqChain[]
  date_closed?: string
  date_created?: string
  date_refreshed?: string
  description?: string
  distance?: number
  email?: string
  extended_location?: FsqExtendedLocation
  attributes?: FsqAttributes
  hours?: FsqHours
  hours_popular?: FsqHoursPeriod[]
  link?: string
  location?: FsqLocation
  menu?: string
  name?: string
  photos?: FsqPhoto[]
  place_actions?: FsqPlaceAction[]
  popularity?: number
  placemaker_url?: string
  price?: number
  rating?: number
  related_places?: {
    parent?: FsqRelatedPlace
    children?: FsqRelatedPlace[]
  }
  social_media?: FsqSocialMedia
  stats?: FsqStats
  store_id?: string
  tastes?: string[]
  tel?: string
  tips?: FsqTip[]
  verified?: boolean
  unresolved_flags?: string[]
  veracity_rating?: Record<string, any>
  website?: string
  plugins?: {
    traversable_again?: boolean
    [key: string]: any
  }
}

// ─── Response ─────────────────────────────────────────────────────────────────

export interface FsqPlaceSearchResponse {
  results: FsqPlace[]
  context?: {
    geo_bounds?: {
      circle?: {
        center?: {
          latitude: number
          longitude: number
        }
        radius?: number
      }
    }
  }
}
