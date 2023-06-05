import { Api } from '@/services/api/Api';
import { store } from '@/store';
import { ref } from 'vue';
import jwtDecode from 'jwt-decode'
import useVuelidate from '@vuelidate/core';
import { email, helpers, required } from '@vuelidate/validators'
import router from '@/router';


export const useSignIn = () => {
  const credentials = ref({
    email: '',
    password: ''
  })

  const rules = {
    email: {
      required: helpers.withMessage('Preencha seu E-mail', required),
      email: helpers.withMessage('Preencha com um E-mail válido', email),
    },
    password: {
      required: helpers.withMessage('Preencha sua Senha', required)
    }
  }

  const v$ = useVuelidate(rules, credentials)

  const authUser = async (credentials: { email: string, password: string }) => {

    const { authorization_token } = await Api.auth.signIn(credentials.email, credentials.password)

    localStorage.setItem('authorization', authorization_token)

    return jwtDecode(authorization_token) as any
  }

  const findUser = async (id: number) => {
    const user = await Api.users.findById(id)
    await store.dispatch('saveUser', user)
  }

  const signIn = async () => {
    const result = await v$.value.$validate()

    if (!result) {
      return;
    }

    const decoded = await authUser(credentials.value);
    await findUser(decoded.sub)

    await router.push('/tabs/')
  }

  return {
    credentials,
    signIn,
    v$
  }
}
