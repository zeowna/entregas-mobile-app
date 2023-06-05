import { computed } from 'vue';
import { PartnerProduct } from '@/services/api/types';
import { store } from '@/store';

export const useCart = () => {
  const cart = computed(() => store.state.cart)

  const getCartProduct = (productId: number) => cart.value.find(({ partnerProduct: { id } }) => id === productId)

  const addProduct = async (partnerProduct: PartnerProduct) => store.dispatch('addProductInCart', partnerProduct)
  const removeProduct = async (partnerProduct: PartnerProduct) => store.dispatch('removeProductFromCart', partnerProduct)

  const sumCartValue = () => cart.value.reduce((acc, { quantity, value }) => acc + (value * quantity), 0)

  return {
    cart,
    getCartProduct,
    addProduct,
    removeProduct,
    sumCartValue
  }
}
