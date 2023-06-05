import { AppState } from '@/store';
import { CartProduct, Order, Partner, PartnerProduct, User } from '@/services/api/types';

const getCartProduct = (cart: CartProduct[]) => (productId: number) => cart.find(({ partnerProduct: { id } }) => id === productId)

const deleteProductFromCart = (cart: CartProduct[]) => (productId: number) => cart
  .reduce<CartProduct[]>((acc, cartProduct) => (cartProduct.partnerProduct.id === productId)
      ? acc
      : [...acc, cartProduct]
    , [])


export const mutations = {
  SAVE_PARTNERS: (state: AppState, partners: Partner[]) => {
    state.partners = [...state.partners, ...partners]
  },
  SAVE_ORDERS: (state: AppState, orders: Order[]) => {
    state.orders = [...state.orders, ...orders]
  },
  SAVE_USER: (state: AppState, user: User) => {
    state.user = user
  },
  ADD_PRODUCT_IN_CART: (state: AppState, partnerProduct: PartnerProduct) => {
    const found = getCartProduct(state.cart)(partnerProduct.id as number)

    if (found) {
      found.quantity += 1
      return;
    }

    state.cart.push({
      value: partnerProduct.value,
      quantity: 1,
      partnerProduct: partnerProduct
    })
  },
  REMOVE_PRODUCT_FROM_CART: (state: AppState, partnerProduct: PartnerProduct) => {
    const found = getCartProduct(state.cart)(partnerProduct.id as number)

    if (found?.quantity) {
      found.quantity -= 1

      if (!found.quantity) {
        state.cart = deleteProductFromCart(state.cart)(partnerProduct.id as number)
      }
    }
  }
}
