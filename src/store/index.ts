import { createStore } from "vuex";
import { getters } from "@/store/getters";
import { actions } from "@/store/actions";
import { mutations } from "@/store/mutations";
import { CartProduct, Order, Partner, User } from '@/services/api/types';

export interface AppState {
  baseURL: string
  user: User | null
  partners: Partner[]
  orders: Order[]
  cart: CartProduct[]
}

const initialState: AppState = {
  baseURL: 'http://localhost:3000',
  user: null,
  partners: [],
  orders: [],
  cart: []
}
export const store = createStore({
  state: initialState,
  getters: getters,
  actions: actions,
  mutations: mutations
})
