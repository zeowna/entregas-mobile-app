import { computed, ref, watch } from "vue";
import { Address, CustomerUser } from "@/services/api/types";
import { store } from "@/store";
import { Api } from "@/services/api/Api";
import { loadingController } from "@ionic/vue";
import { ActionTypes } from "@/store/actions";
import { Dialog } from "@capacitor/dialog";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

const addressesVisible = ref(false)
const user = computed<CustomerUser>(() => store.getters.getUser)
const addresses = computed<Address[]>(() => user.value?.addresses as Address[])
const showForm = ref(false)

const address = ref<Address>({
  cep: '',
  street: '',
  neighbourhood: '',
  number: null,
  complement: '',
  city: '',
  state: ''
})

const selectedAddress = ref<Address | null>(null)

const rules = computed(() => ({
  cep: { required: helpers.withMessage('CEP é obrigatório', required) },
  street: { required: helpers.withMessage('Preencha a Rua do Parceiro', required) },
  neighbourhood: { required: helpers.withMessage('Número é obrigatório', required) },
  number: { required: helpers.withMessage('Número é obrigatório', required) },
  city: { required: helpers.withMessage('Preencha a Cidade do Parceiro', required) },
  state: { required: helpers.withMessage('UF é obrigatório', required) }
}))

const v$ = useVuelidate(rules, address)

const reset = () => {
  showForm.value = false

  address.value = {
    cep: '',
    street: '',
    neighbourhood: '',
    number: null,
    complement: '',
    city: '',
    state: ''
  }
}

const toggleForm = () => {
  showForm.value = !showForm.value
}


const toggleAddressesModal = () => {
  addressesVisible.value = !addressesVisible.value

  if(!addressesVisible.value) {
    reset()
  }
}

const findAddressByCep = async () => {
  const cep = address.value.cep.replace(/[^a-zA-Z0-9 ]/g, '')

  if (cep.length < 8) {
    return
  }

  const loading = await loadingController.create({
    message: 'Carregando...',
  });
  await loading.present()
  try {
    address.value = await Api.addresses.findByCep(cep)
  } catch (err) {
    console.error(err)
  } finally {
    await loading.dismiss()
  }
}

const createAddress = async () => {
  const formValidation = await v$.value.$validate()

  if (!formValidation) {
    throw new Error(v$.value.$errors.map((e) => e.$message).join())
  }

  const loading = await loadingController.create({
    message: 'Carregando...',
  });
  await loading.present()
  try {
    selectedAddress.value = await Api.customers.addresses.create(
      user.value.id as number,
      { ...address.value, number: Number.parseInt(`${address.value.number}`) }
    )
    await store.dispatch(ActionTypes.REFRESH_TOKEN, { force: true})
  } catch (err) {
    console.error(err)
  } finally {
    reset()
    await loading.dismiss()

  }
}

const removeAddress = async (addressId: number) => {
  const {  value } = await Dialog.confirm({
    title: 'Remover endereço',
    message: 'Deseja remover este endereço?'
  })


  if (!value) {
    return
  }

  const loading = await loadingController.create({
    message: 'Carregando...',
  });
  await loading.present()
  try {
    await Api.customers.addresses.remove(
      user.value.id as number,
      addressId
    )
    await store.dispatch(ActionTypes.REFRESH_TOKEN, { force: true})
  } catch (err) {
    console.error(err)
  } finally {
    reset()
    await loading.dismiss()
  }
}

watch(() => addresses.value, (value) => {
  if (!selectedAddress.value && value?.length) {
    selectedAddress.value = value[0]
  }
})

export const useAddress = () => {
  return {
    addressesVisible,
    selectedAddress,
    showForm,
    address,
    addresses,
    v$,
    reset,
    toggleForm,
    toggleAddressesModal,
    findAddressByCep,
    createAddress,
    removeAddress
  }
}
