import { computed, ref } from "vue";
import { CustomerUser, Order, OrderStatus } from "@/services/api/types";
import { store } from "@/store";
import { Api } from "@/services/api/Api";
import { alertController, loadingController } from "@ionic/vue";
import { useListOrders } from "@/composables/useListOrders";

const orderVisible = ref(false)
const user = computed<CustomerUser>(() => store.getters.getUser)
const order = ref<Order | null>()
const { reset: resetOrderList, findOrders } = useListOrders()

const reset = () => {
  order.value = null
}

const toggleOrderModal = async (orderId?: number) => {
  orderVisible.value = !orderVisible.value

  if (!orderVisible.value) {
    reset()
    return
  }

  if (orderId) {
    await findOrderById(orderId)
  }
}

const findOrderById = async (id: number) => {
  const loading = await loadingController.create({
    message: 'Carregando...',
  });
  await loading.present()

  try {
    order.value = await Api.customers.orders.findById(user.value.id as number, id)

  } catch (err) {
    await toggleOrderModal()
  } finally {
    await loading.dismiss()
  }

}

const cancelOrder = async () => {
  const alert = await alertController.create({
    header: 'Deseja cancelar o pedido?',
    buttons: [
      {
        text: 'Não',
        role: "cancel"
      },
      {
        text: 'Sim',
        handler: async () => {
          const loading = await loadingController.create({
            message: 'Carregando...',
          });
          await loading.present()

          try {
            order.value = await Api.customers.orders.updateStatus(user.value.id as number, order.value!.id as number, OrderStatus.CanceledByCustomer)
            resetOrderList()
            await findOrders()
          } catch (err) {
            await toggleOrderModal()
          } finally {
            await loading.dismiss()
          }
        }
      }
    ]
  })

  alert.present()
}

export const useOrder = () => {
  return {
    orderVisible,
    order,
    reset,
    toggleOrderModal,
    findOrderById,
    cancelOrder
  }
}
