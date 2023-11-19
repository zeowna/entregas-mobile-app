import { ref } from 'vue';
import { Partner, PartnerProduct, PartnerProductStatus } from '@/services/api/types';
import { Api } from "@/services/api/Api";

const partner = ref<Partner | null>()
const partnerProducts = ref([] as PartnerProduct[])
const groupedPartnerProducts = ref<Record<string, PartnerProduct[]>>({})

const getPartner = async (id: number) => {
  partner.value = await Api.partners.findById(id)
}

const getProducts = async (id: number) => {
  const data = await Api.partners.products.find(id, {
    conditions: {
      status: { eq: PartnerProductStatus.Active },
      inStockQuantity: { gt: 0 }
    },
    limit: 9999,
    sort: {
      name: 1
    }
  })

  partnerProducts.value = data.list.sort((a, b) => b!.product!.category!.id! - a!.product!.category!.id!)

  groupedPartnerProducts.value = partnerProducts.value.reduce((acc, product) => {
    const index = product!.product!.category!.name
    if (!acc[index]) {
      acc[index] = []
    }

    return {
      ...acc,
      [index]: [...acc[index], product]
    }

  }, {} as Record<string, PartnerProduct[]>)

  console.log(groupedPartnerProducts.value)
}

export const usePartner = () => {
  return { getPartner, getProducts, partner, partnerProducts, groupedPartnerProducts }
}
