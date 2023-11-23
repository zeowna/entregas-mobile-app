import { Dialog } from '@capacitor/dialog';
import router from '@/router';
import { computed } from 'vue';
import { store } from '@/store';
import { useAddress } from "@/composables/useAddress";
import { useCart } from "@/composables/useCart";
import { ActionTypes } from "@/store/actions";

export const useMyData = () => {
  const customer = computed(
    () => store.getters.getUser
  )

  const signOut = async () => {
    const { value } = await Dialog.confirm({
      title: 'Sair do App',
      message: `Deseja sair do App?`,
    });

    const { reset: resetAddress } = useAddress()
    const { reset: resetCart } = useCart()
    resetAddress()
    resetCart()

    await store.dispatch(ActionTypes.SIGN_OUT)

    if (value) {
      await router.push('/')
    }
  }

  return {
    customer,
    signOut
  }
}
