import { ref } from 'vue';
import { CartProduct, Partner, PartnerProduct } from '@/services/api/types';

const partner = ref<Partner | null>(null)
const cart = ref<CartProduct[]>([])
const cartVisible = ref(false)

const toggleCart = () => {
  cartVisible.value = !cartVisible.value
}

const reset = () => {
  partner.value = null
  cart.value = []
}

const deleteProductFromCart = (productId: number) => cart.value
  .reduce<CartProduct[]>((acc, cartProduct) => (cartProduct.partnerProduct.id === productId)
      ? acc
      : [...acc, cartProduct]
    , [])

const getCartProduct = (productId: number) => cart.value.find(({ partnerProduct: { id } }) => id === productId)
const addProduct = async (partnerProduct: PartnerProduct) => {
  const found = getCartProduct(partnerProduct.id as number)
  partner.value = partnerProduct.partner as Partner

  if (found) {
    found.quantity += 1
    found.totalValue += found.value
    return;
  }

  cart.value.push({
    value: partnerProduct.value,
    quantity: 1,
    partnerProduct: partnerProduct,
    partnerProductId: partnerProduct.id as number,
    totalValue: partnerProduct.value,
  })
}

const removeProduct = async (partnerProduct: PartnerProduct) => {
  const found = getCartProduct(partnerProduct.id!)

  if (found?.quantity) {
    found.quantity -= 1
    found.totalValue -= found.value

    if (!found.quantity) {
      cart.value = deleteProductFromCart(partnerProduct.id as number)
    }
  }
}
const sumCartValue = () => cart.value.reduce((acc, { quantity, value }) => acc + (value * quantity), 0)

export const useCart = () => {
  return {
    cart,
    partner,
    cartVisible,
    reset,
    getCartProduct,
    addProduct,
    removeProduct,
    sumCartValue,
    toggleCart
  }
}
