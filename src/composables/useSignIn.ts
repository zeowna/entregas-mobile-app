import { Api } from '@/services/api/Api';
import { store } from '@/store';
import { computed, ref } from 'vue';
import jwtDecode from 'jwt-decode'
import useVuelidate from '@vuelidate/core';
import { email, helpers, required } from '@vuelidate/validators'
import router from '@/router';
import { Dialog } from '@capacitor/dialog';
import { loadingController } from '@ionic/vue';


export const useSignIn = () => {
  const credentials = ref({
    email: '',
    password: ''
  })

  const rules = computed(() => ({
    email: {
      required: helpers.withMessage('Preencha seu E-mail', required),
      email: helpers.withMessage('Preencha com um E-mail válido', email),
    },
    password: {
      required: helpers.withMessage('Preencha sua Senha', required)
    }
  }))

  const v$ = useVuelidate(rules, credentials, { $stopPropagation: true })

  const showLoading = async () => {
    const loading = await loadingController.create({
      message: 'Entrando...',
    });
    await loading.present();

    return loading;
  };

  const authUser = async () => {
    const { authorization_token } = await Api.auth.signIn(credentials.value.email, credentials.value.password)

    localStorage.setItem('authorization', authorization_token)

    return jwtDecode(authorization_token) as any
  }

  const findUser = async (id: number) => {
    const user = await Api.users.findById(id)
    await store.dispatch('saveUser', user)
  }

  const signIn = async () => {
    const loading = await showLoading()

    try {
      const result = await v$.value.$validate()

      if (!result) {
        return;
      }

      const decoded = await authUser();
      await findUser(decoded.sub)

      await router.push('/tabs/')
    } catch (err) {
      await Dialog.alert({
        title: 'Erro ao entrar',
        message: err instanceof Error
          ? err.message
          : err as string,
      });
    } finally {
      await loading.dismiss()
    }
  }

  return {
    credentials,
    signIn,
    v$
  }
}
