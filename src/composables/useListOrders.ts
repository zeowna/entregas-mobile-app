import { OrderStatus } from '@/services/api/types';
import { computed, onMounted, ref } from 'vue';
import { store } from '@/store';
import { Api } from '@/services/api/Api';

export const useListOrders = () => {
  const orders = computed(() => store.state.orders)
  const shouldFindMorePartners = ref(false)

  const findOrders = async () => {
    const orders = await Api.orders.find()

    await store.dispatch('saveOrders', orders)
    shouldFindMorePartners.value = true
  }

  const getOrderStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Canceled:
        return 'danger'
      case OrderStatus.Settled:
        return 'success'
      case OrderStatus.Created:
        return 'warning'
      case OrderStatus.InDelivery:
        return 'primary'
      case OrderStatus.AwaitingExecution:
        return 'secondary'
    }
  }

  const getOrderStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Canceled:
        return 'Cancelado'
      case OrderStatus.Created:
        return 'Pedido Criado'
      case OrderStatus.AwaitingExecution:
        return 'Aguardando Pagamento'
      case OrderStatus.InDelivery:
        return 'Entrega a caminho'
      case OrderStatus.Settled:
        return 'Finalizado'
    }
  }

  const ionInfinite = async (ev: Event) => {
    await findOrders()
    setTimeout(() => (ev.target as any).complete(), 2000);
  }

  onMounted(async () => findOrders())

  return {
    orders,
    getOrderStatusColor,
    getOrderStatusText,
    shouldFindMorePartners,
    ionInfinite
  }
}

