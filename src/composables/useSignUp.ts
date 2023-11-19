import { CustomerUser } from '@/services/api/types';
import { computed, ref } from 'vue';
import { store } from '@/store';
import useVuelidate from '@vuelidate/core';
import { email, helpers, required, sameAs, } from '@vuelidate/validators';
import { loadingController } from '@ionic/vue';
import { Dialog } from '@capacitor/dialog';
import { ValidationError } from '@/services/api/errors';
import { BadRequestError } from '@/services/api/errors/BadRequestError';
import { DateTime } from 'luxon';

export const useSignUp = () => {
  const initialInput = {
    name: '',
    cpf: '',
    birthday: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  }

  const input = ref(initialInput)

  const errorsFromRequest = ref({} as Record<string, ValidationError>)


  const rules = computed(() => ({
    name: {     required: helpers.withMessage('Nome é obrigatório', required),
    },
    cpf: {     required: helpers.withMessage('CPF é obrigatório', required),
     },
    birthday: {
      required: helpers.withMessage('Data de nascimento é obrigatória', required)
    },
    email: {
      required: helpers.withMessage('E-mail é obrigatório', required),
      email: helpers.withMessage('E-mail precisa ser um e-mail', email),
    },
    password: { required },
    passwordConfirmation: {
      required: helpers.withMessage('Confirmar senha é obrigatório', required),
      sameAs:  helpers.withMessage('Confirmar senha precisa coincidir com Senha', sameAs(input.value.password))
    }
  }))


  const v$ = useVuelidate(rules, input, { $stopPropagation: true })

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

      const customer: CustomerUser = {
        ...input.value,
        birthday: DateTime.fromISO(input.value.birthday).set({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0
        }).toJSDate()
      }

      await store.dispatch('createCustomer', customer)

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

      return false
    } finally {
      await loading.dismiss()
    }
  }

  return {
    user: input,
    createUser,
    v$,
    errorsFromRequest
  }
}
