import { Dialog } from '@capacitor/dialog';
import router from '@/router';
import { computed } from 'vue';
import { store } from '@/store';

export const useMyData = () => {
  const customer = computed(
    () => store.getters.getUser
  )

  const signOut = async () => {
    const { value } = await Dialog.confirm({
      title: 'Sair do App',
      message: `Deseja sair do App?`,
    });

    if (value) {
      await router.push('/')
    }
  }

  return {
    customer,
    signOut
  }
}
