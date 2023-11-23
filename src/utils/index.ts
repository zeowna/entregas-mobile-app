import { Address } from "@/services/api/types";

export const centsToCurrency = (value: number) => typeof value === 'number' ? 'R$ ' + (value / 100).toFixed(2).replace('.', ',') : 'R$ 0'
export const centsToValue = (value: number) => value / 100
export const formatAddress = (address: Address) => address ? `${address.street}, ${address.number},  ${address.neighbourhood} - ${address.city}` : ''

export const formatAddressSmall = (address: Address) => address ? `${address.street}, ${address.number}` : ''

export const getDistance = ({ lat: lat1, lng: lng1 }: Address, { lat: lat2, lng: lng2 }: Address) => {
  const radlat1 = Math.PI * lat1! / 180
  const radlat2 = Math.PI * lat2! / 180
  const theta = lng1! - lng2!
  const radtheta = Math.PI * theta / 180
  let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180 / Math.PI
  dist = dist * 60 * 1.1515

  const km = dist * 1.609344

  return km < 1
    ? (km * 1000).toFixed(0) + 'm'
    : km.toFixed(2) + 'km'

}
