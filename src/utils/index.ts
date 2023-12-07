import { Address, OrderPaymentMethods, OrderStatus } from "@/services/api/types";

export const centsToCurrency = (value: number) => typeof value === 'number' ? 'R$ ' + (value / 100).toFixed(2).replace('.', ',') : 'R$ 0'
export const centsToValue = (value: number) => value / 100
export const formatAddress = (address: Address) => address ? `${address.street}, ${address.number},  ${address.neighbourhood} - ${address.city}` : ''

export const formatAddressSmall = (address: Address) => {
  if (!address) {
    return ''
  }

  const [type, ...rest] = address.street.split(' ')

  const typeSmall = type.length > 3 ? `${type.substring(0, 2)}` : type

  return `${typeSmall} ${rest.join(' ')}, ${address.number}`
}

const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;


export const getDistance = ({ lat: lat1, lng: lng1 }: Address, { lat: lat2, lng: lng2 }: Address) => {
  const startingLat = degreesToRadians(lat1 as number);
  const startingLong = degreesToRadians(lng1 as number);
  const destinationLat = degreesToRadians(lat2 as number);
  const destinationLong = degreesToRadians(lng2 as number);

  // Radius of the Earth in kilometers
  const radius = 6571;

  // Haversine equation
  const distanceInKilometers = Math.acos(Math.sin(startingLat) * Math.sin(destinationLat) +
    Math.cos(startingLat) * Math.cos(destinationLat) *
    Math.cos(startingLong - destinationLong)) * radius;

  if (distanceInKilometers < 1) {
    return `${(distanceInKilometers / 1000).toFixed(0)}m`
  }

  return `${distanceInKilometers.toFixed(1)}km`

}

export const formatOrderNumber = (number: number) => `${number}`.padStart(4, '0')

export const getOrderStatusColorWeb = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Created:
      return 'info'
    case OrderStatus.CanceledByPartner:
    case OrderStatus.CanceledByCustomer:
    case OrderStatus.RefusedByPartner:
      return 'danger'
    case OrderStatus.AcceptedByPartner:
      return 'warning'
    case OrderStatus.AwaitingExecution:
      return 'warning'
    case OrderStatus.InDelivery:
      return 'info'
    case OrderStatus.Settled:
      return 'success'
    default:
      return ''
  }
}

export const getOrderStatusColorApp = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Created:
    case OrderStatus.AwaitingPartner:
      return 'primary'
    case OrderStatus.CanceledByPartner:
    case OrderStatus.CanceledByCustomer:
    case OrderStatus.RefusedByPartner:
      return 'danger'
    case OrderStatus.AcceptedByPartner:
      return 'warning'
    case OrderStatus.AwaitingExecution:
      return 'warning'
    case OrderStatus.InDelivery:
      return 'primary'
    case OrderStatus.Settled:
      return 'success'
    default:
      return ''
  }
}

export const formatOrderStatus = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Created:
      return 'Criado'
    case OrderStatus.AwaitingPartner:
      return 'Aguardando aprovação'
    case OrderStatus.CanceledByPartner:
      return 'Cancelado pelo parceiro'
    case OrderStatus.CanceledByCustomer:
      return 'Cancelado pelo cliente'
    case OrderStatus.RefusedByPartner:
      return 'Recusado pelo parceiro'
    case OrderStatus.AcceptedByPartner:
      return 'Aceito pelo parceiro'
    case OrderStatus.AwaitingExecution:
      return 'Aguardando pagamento'
    case OrderStatus.InDelivery:
      return 'Saiu para entrega'
    case OrderStatus.Settled:
      return 'Finalizado'
    default:
      return ''
  }
}

export const formatOrderPaymentMethod = (status: OrderPaymentMethods) => {
  switch (status) {
    case OrderPaymentMethods.DebitCardLocation:
      return 'Débito na entrega'
    case OrderPaymentMethods.CreditCardLocation:
      return 'Crédito na entrega'
    case OrderPaymentMethods.CashLocation:
      return 'Dinheiro na entrega'
    case OrderPaymentMethods.CardRemote:
      return 'Crédito/Debito no App'
    default:
      return ''
  }
}
