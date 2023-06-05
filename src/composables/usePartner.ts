import { onMounted, ref } from 'vue';
import { PartnerProduct } from '@/services/api/types';
import { Api } from '@/services/api/Api';

export const usePartner = (id: number) => {


  const partnerProducts = ref([] as PartnerProduct[])

  const getProducts = async () => {
    partnerProducts.value = await Api.partners.products.find(id)
  }


  onMounted(async () => await getProducts())

  return { partnerProducts }
}
