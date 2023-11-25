import router from '@/router';
import { computed } from 'vue';
import { store } from '@/store';
import { useAddress } from "@/composables/useAddress";
import { useCart } from "@/composables/useCart";
import { ActionTypes } from "@/store/actions";
import { alertController } from "@ionic/vue";

export const useMyData = () => {
  const customer = computed(
    () => store.getters.getUser
  )

  const signOut = async () => {
    const  alert = await alertController.create({
      header: 'Sair do App',
      message: `Deseja sair do App?`,
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            const { reset: resetAddress } = useAddress()
            const { reset: resetCart } = useCart()
            resetAddress()
            resetCart()

            await store.dispatch(ActionTypes.SIGN_OUT)

              await router.push('/')

          }
        },
        { text: 'Não', role: "cancel"},
      ]
    })

    await alert.present()
  }

  return {
    customer,
    signOut
  }
}
