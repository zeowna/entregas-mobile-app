import { User, UserTypes } from '@/services/api/types';
import { computed, ref } from 'vue';
import { Api } from '@/services/api/Api';
import { store } from '@/store';
import useVuelidate from '@vuelidate/core';
import { email, helpers, required, sameAs, } from '@vuelidate/validators';
import { loadingController } from '@ionic/vue';
import { Dialog } from '@capacitor/dialog';
import { ValidationError } from '@/services/api/errors';
import { BadRequestError } from '@/services/api/errors/badRequestError';

export const useSignUp = () => {
  const initialUser = {
    type: UserTypes.Customer,
    name: '',
    cpf: '',
    birthday: null,
    email: '',
    password: '',
    passwordConfirmation: '',
  }

  const user = ref(initialUser)

  const errorsFromRequest = ref({} as Record<string, ValidationError>)


  const rules = computed(() => ({
    name: { required },
    cpf: { required, },
    birthday: {
      required: helpers.withMessage('Data de nascimento é obrigatória', required)
    },
    email: {
      required,
      email
    },
    password: { required },
    passwordConfirmation: {
      required,
      sameAs: sameAs(user.value.password)
    }
  }))


  const v$ = useVuelidate(rules, user, { $stopPropagation: true })

  const showLoading = async () => {
    const loading = await loadingController.create({
      message: 'Criando conta...',
    });
    await loading.present();

    return loading;
  };


  const createUser = async () => {
    const loading = await showLoading()
    errorsFromRequest.value = {}

    try {
      const result = await v$.value.$validate()

      if (!result) {
        return false;
      }

      const created = await Api.users.create(
        user.value as any as User
      )
      await store.dispatch('saveUser', created)

      return true
    } catch (err) {
      await Dialog.alert({
        title: 'Erro!',
        message: "Erro ao Criar Conta"
      });

      if (err instanceof BadRequestError) {
        err.errors.map(
          (validationErr) => errorsFromRequest.value[validationErr.property] = validationErr)
      }

      console.log(errorsFromRequest.value)

      return false
    } finally {
      await loading.dismiss()
    }

  }

  return {
    user,
    createUser,
    v$,
    errorsFromRequest
  }
}
