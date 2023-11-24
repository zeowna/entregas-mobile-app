import { ref } from 'vue';
import { Api } from '@/services/api/Api';
import { FindEntitiesPaging, FindEntitiesResponse, Partner, PartnerStatuses } from "@/services/api/types";

const shouldFindMorePartners = ref(false)

const data = ref<FindEntitiesResponse<Partner>>({
  list: [],
  count: 0,
  skip: 0,
  limit: 0,
  pages: 0
})
const params = ref<FindEntitiesPaging>({
  conditions: { status: { eq: PartnerStatuses.Active } },
  skip: 0,
  limit: 10
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
    conditions: { status: { eq: PartnerStatuses.Active } },
    skip: 0,
    limit: 10
  }
}

const findPartners = async () => {
  isLoading.value = true
  const found = await Api.partners.find(params.value)

  data.value.list = [
    ...data.value.list,
    ...found.list
  ]
  params.value.skip! += params.value.limit!

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
