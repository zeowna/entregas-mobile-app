import { computed, onMounted, ref } from 'vue';
import { Api } from '@/services/api/Api';
import { store } from '@/store';

export const useListPartners = () => {
  const shouldFindMorePartners = ref(false)
  const location = ref('Rua Mato Grosso 293, Curitiba - PR')

  const partners = computed(() => store.state.partners)

  const findPartners = async () => {
    const partners = await Api.partners.find()
    await store.dispatch('savePartners', partners)
    shouldFindMorePartners.value = true
  }

  const getAddressText = (address: any) => `${address.street}, ${address.number},  ${address.neighbourhood} - ${address.city}`

  const ionInfinite = async (ev: Event) => {
    await findPartners()
    setTimeout(() => (ev.target as any).complete(), 2000);
  }

  onMounted(async () => findPartners())

  return {
    shouldFindMorePartners,
    location,
    partners,
    getAddressText,
    ionInfinite
  }
}
