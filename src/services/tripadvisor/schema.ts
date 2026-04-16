import type { AnyCaaRecord } from 'node:dns'

export interface Location {
  location_id: string
  name: string
  address_obj: AddressObj
}

export interface SearchResponse {
  data: Array<Location>
}

export interface LocalizedName {
  name: string
  localized_name: string
}

export interface AddressObj {
  street1?: string
  street2?: string
  city?: string
  state?: string
  country?: string
  postalcode?: string
  address_string?: string
}

export interface Ancestor {
  abbrv?: string
  level: string
  name: string
  location_id: number
}

export interface RankingData {
  geo_location_id: number
  ranking_string: string
  geo_location_name: string
  ranking_out_of: number
  ranking: number
}

export interface ReviewRatingCount {
  1?: number
  2?: number
  3?: number
  4?: number
  5?: number
}

export interface HoursPeriodTime {
  day: number
  time: string
}

export interface HoursPeriod {
  open: HoursPeriodTime
  close?: HoursPeriodTime
}

export interface Hours {
  periods: Array<HoursPeriod>
  weekday_text: Array<string>
}

export interface Cuisine {
  name: string
  localized_name: string
}

export interface Subcategory {
  name: string
  localized_name: string
}

export interface Category {
  name: string
  localized_name: string
}

export interface AttractionCategory {
  name: string
  localized_name: string
}

export interface Group {
  name: string
  localized_name: string
  categories: Array<AttractionCategory>
}

export interface NeighborhoodInfo {
  location_id: string
  name: string
}

export interface TripType {
  name: string
  localized_name: string
  value: string
}

export interface AwardImages {
  small?: string
  large?: string
}

export interface Award {
  award_type: string
  year: number
  images: AwardImages
  categories: Array<string>
  display_name: string
}

export interface LocationDetails {
  location_id: number
  name: string
  description?: string
  web_url?: string
  address_obj?: AddressObj
  ancestors?: Array<Ancestor>
  latitude?: number
  longitude?: number
  timezone?: string
  email?: string
  phone?: string
  website?: string
  write_review?: string
  ranking_data?: RankingData
  rating?: number
  rating_image_url?: string
  num_reviews?: string
  review_rating_count?: ReviewRatingCount
  subratings?: Record<string, AnyCaaRecord>
  photo_count?: number
  see_all_photos?: string
  price_level?: string
  hours?: Hours
  amenities?: Array<string>
  features?: Array<string>
  cuisine?: Array<Cuisine>
  parent_brand?: string
  brand?: string
  category?: Category
  subcategory?: Array<Subcategory>
  groups?: Array<Group>
  styles?: Array<string>
  neighborhood_info?: Array<NeighborhoodInfo>
  trip_types?: Array<TripType>
  awards?: Array<Award>
}

export interface LocationDetailsError {
  message: string
  type: string
  code: number
}

export interface LocationDetailsResponse {
  data?: LocationDetails
  error?: LocationDetailsError
}

export interface PhotoImageSize {
  width: number
  url: string
  height: number
}

export interface PhotoUserLocation {
  name: string
  id: string
}

export interface PhotoUser {
  username: string
  user_location: PhotoUserLocation
  review_count: number
  reviewer_badge: string
  avatar: Record<string, string>
}

export interface PhotoSource {
  name: string
  localized_name: string
}

export type PhotoImageSizeType =
  | 'thumbnail'
  | 'small'
  | 'medium'
  | 'large'
  | 'original'

export interface Photo {
  id: number
  is_blessed: boolean
  album: string
  caption: string
  published_date: string
  images: Record<PhotoImageSizeType, PhotoImageSize>
  source: PhotoSource
  user: PhotoUser
}

export interface PhotosPaging {
  next: string
  previous: string
  results: number
  total_results: number
  skipped: number
}

export interface PhotosError {
  message: string
  type: string
  code: number
}

export interface PhotosResponse {
  data: Array<Photo>
  paging: PhotosPaging
  error?: PhotosError
}
