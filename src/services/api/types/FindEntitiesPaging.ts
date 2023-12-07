export interface FindEntitiesPaging {
  conditions?: any
  skip?: number
  limit?: number
  sort?: any
}

export interface FindPartnersByDistancePaging {
  coordinates: { lat: number, lng: number } | null
  skip?: number
  limit?: number
  maxDistanceInMeters?: number
}