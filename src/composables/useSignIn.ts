import { Api } from '@/services/api/Api';
import { store } from '@/store';
import { computed, ref } from 'vue';
import jwtDecode from 'jwt-decode'
import useVuelidate from '@vuelidate/core';
import { email, helpers, required } from '@vuelidate/validators'
import router from '@/router';
import { Dialog } from '@capacitor/dialog';
import { alertController, loadingController } from '@ionic/vue';
import { ActionTypes } from "@/store/actions";

const credentials = ref({
  email: '',
  password: ''
})

const rules = computed(() => ({
  email: {
    required: helpers.withMessage('E-mai é obrigatório', required),
    email: helpers.withMessage('E-mail precisa ser um e-mail', email),
  },
  password: {
    required: helpers.withMessage('Senha é obrigatório', required)
  }
}))

const v$ = useVuelidate(rules, credentials)

const showLoading = async () => {
  const loading = await loadingController.create({
    message: 'Entrando...',
  });
  await loading.present();

  return loading;
};

const signIn = async () => {
  const loading = await showLoading()

  try {
    const result = await v$.value.$validate()

    if (!result) {
      throw new Error(v$.value.$errors.map((e) => e.$message).join())
    }

    await store.dispatch(ActionTypes.SIGN_IN, credentials.value)

    await router.push('/tabs/')
  } catch (err) {
    console.log(err)

    const alert = await alertController.create({
      header: 'Erro ao entrar',
      message: err instanceof Error
        ? err.message
        : err as string,
      buttons: ['Ok']
    })

    await alert.present()
  } finally {
    await loading.dismiss()
  }
}

const forgotPassword = async () => {
  const loading = await loadingController.create({
    message: 'Enviando...',
  });
  await loading.present();

  try {
    if (!credentials.value.email) {
      const alert = await alertController.create({
        header: 'Erro ao processar',
        message: 'Precisamos do seu E-mail para te enviar uma nova senha',
        buttons: ['Ok']
      })

      await alert.present()

      return
    }

    await Api.auth.forgotPassword(credentials.value.email)

    const alert = await alertController.create({
      header: 'Sucesso',
      message: 'Te enviamos uma nova senha',
      buttons: ['Ok']
    })

    await alert.present()

  } catch (err) {
    const alert = await alertController.create({
      header: 'Erro ao processar',
      message: (err as Error).message ?? 'Não foi possível processar uma nova senha!',
      buttons: ['Ok']
    })

    await alert.present()
  } finally {
    await loading.dismiss()
  }
}

export const useSignIn = () => {
  return {
    credentials,
    signIn,
    forgotPassword,
    v$
  }
}
