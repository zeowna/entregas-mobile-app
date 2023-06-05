import { ActionContext } from 'vuex';
import { Order, PartnerProduct, User } from '@/services/api/types';

export const actions = {
  savePartners: async ({ commit }: ActionContext<any, any>, partners: User[]) => {
    commit('SAVE_PARTNERS', partners)
  },
  saveOrders: async ({ commit }: ActionContext<any, any>, orders: Order[]) => {
    commit('SAVE_ORDERS', orders)
  },
  saveUser: async ({ commit }: ActionContext<any, any>, user: User) => {
    commit('SAVE_USER', user)
  },
  addProductInCart({ commit }: ActionContext<any, any>, partnerProduct: PartnerProduct) {
    commit('ADD_PRODUCT_IN_CART', partnerProduct)
  },
  removeProductFromCart({ commit }: ActionContext<any, any>, partnerProduct: PartnerProduct) {
    commit('REMOVE_PRODUCT_FROM_CART', partnerProduct)
  }
}
