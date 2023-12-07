import { ref } from 'vue';
import { Api } from '@/services/api/Api';
import {
  FindEntitiesPaging,
  FindEntitiesResponse,
  FindPartnersByDistancePaging,
  Partner,
  PartnerStatuses
} from "@/services/api/types";

const shouldFindMorePartners = ref(false)

const data = ref<FindEntitiesResponse<Partner>>({
  list: [],
  count: 0,
  skip: 0,
  limit: 0,
  pages: 0
})
const params = ref<FindPartnersByDistancePaging>({
  coordinates: null,
  skip: 0,
  limit: 10,

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
    coordinates: null,
    skip: 0,
    limit: 10,
  }
}

const findPartners = async () => {
  isLoading.value = true
  const found = await Api.partners.findByDistance(params.value)

  data.value.list = [
    ...data.value.list,
    ...found.list
  ]
  params.value.skip! += params.value.limit as number

  shouldFindMorePartners.value = !!found.list.length
  isLoading.value = false
}

const ionInfinite = async (ev: Event) => {
  await findPartners()
}

export const useListPartners = () => {
  return {
    shouldFindMorePartners,
    location,
    params,
    data,
    reset,
    findPartners,
    ionInfinite
  }
}
