import { OrderStatuses } from '@/services/api/types';
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

  const getOrderStatusColor = (status: OrderStatuses) => {
    switch (status) {
      case OrderStatuses.Canceled:
        return 'danger'
      case OrderStatuses.Settled:
        return 'success'
      case OrderStatuses.Created:
        return 'warning'
      case OrderStatuses.InDelivery:
        return 'primary'
      case OrderStatuses.AwaitingExecution:
        return 'secondary'
    }
  }

  const getOrderStatusText = (status: OrderStatuses) => {
    switch (status) {
      case OrderStatuses.Canceled:
        return 'Cancelado'
      case OrderStatuses.Created:
        return 'Pedido Criado'
      case OrderStatuses.AwaitingExecution:
        return 'Aguardando Pagamento'
      case OrderStatuses.InDelivery:
        return 'Entrega a caminho'
      case OrderStatuses.Settled:
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

