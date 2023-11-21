import { ref } from 'vue';
import { Partner, PartnerProduct, PartnerProductStatus } from '@/services/api/types';
import { Api } from "@/services/api/Api";

const partner = ref<Partner | null>()
const partnerProducts = ref([] as PartnerProduct[])
const groupedPartnerProducts = ref<Record<string, PartnerProduct[]>>({})
const productName = ref('')

const reset = () => {
  partner.value = null
  partnerProducts.value = []
  groupedPartnerProducts.value = {}
  productName.value = ''
}

const getPartner = async (id: number) => {
  partner.value = await Api.partners.findById(id)
}

const groupProductsByCategory = (partnerProducts: PartnerProduct[]) => {
  return partnerProducts.reduce((acc, product) => {
    const index = product!.product!.category!.name
    if (!acc[index]) {
      acc[index] = []
    }

    return {
      ...acc,
      [index]: [...acc[index], product]
    }

  }, {} as Record<string, PartnerProduct[]>)
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
  groupedPartnerProducts.value = groupProductsByCategory(partnerProducts.value)

}

const filterByProductName = () => {
  groupedPartnerProducts.value = groupProductsByCategory(partnerProducts.value.filter(
    ({ product }) => `${product?.name?.toLocaleLowerCase()} ${product?.size?.toLocaleLowerCase()}`.includes(productName.value.toLocaleLowerCase()))
  )
}

export const usePartner = () => {
  return { getPartner, getProducts,filterByProductName, reset, partner, partnerProducts, groupedPartnerProducts, productName }
}
