import { Address } from "@/services/api/types";

export const centsToCurrency = (value: number) => typeof value === 'number' ?  'R$ ' + (value / 100).toFixed(2).replace('.', ',') : 'R$ 0'
export const centsToValue = (value: number) => value / 100
export const formatAddress = (address: Address) => address ? `${address.street}, ${address.number},  ${address.neighbourhood} - ${address.city}` : ''

export const formatAddressSmall = (address: Address) => address ? `${address.street}, ${address.number}` : ''
