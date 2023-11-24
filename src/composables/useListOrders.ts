import { computed, ref } from 'vue';
import { Api } from '@/services/api/Api';
import { FindEntitiesPaging, FindEntitiesResponse, Order, OrderStatus } from "@/services/api/types";
import { store } from "@/store";

const shouldFindMoreOrders = ref(false)
const user = computed(() => store.getters.getUser)

const data = ref<FindEntitiesResponse<Order>>({
  list: [],
  count: 0,
  skip: 0,
  limit: 0,
  pages: 0
})
const params = ref<FindEntitiesPaging>({
  conditions: {},
  skip: 0,
  limit: 10,
  sort: { statusUpdatedAt: -1 }
})
const isLoading = ref(false)

const reset = () => {
  data.value = {
    list: [],
    count: 0,
    skip: 0,
    limit: 0,
    pages: 0
  }

  params.value = {
    conditions: {},
    skip: 0,
    limit: 10,
    sort: { statusUpdatedAt: -1 }
  }
}

const findOrders = async () => {
  isLoading.value = true
  const found = await Api.customers.orders.find(user.value.id as number, params.value)

  data.value.list = [
    ...data.value.list,
    ...found.list
  ]
  params.value.skip! += params.value.limit!

  shouldFindMoreOrders.value = !!found.list.length
  isLoading.value = false
}

const ionInfinite = async (ev: Event) => {
  await findOrders()
}

export const useListOrders = () => {
  return {
    shouldFindMoreOrders,
    location,
    params,
    data,
    reset,
    findOrders,
    ionInfinite
  }
}
