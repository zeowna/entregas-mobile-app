import { User, UserTypes } from '@/services/api/types';
import { computed, ref } from 'vue';
import { Api } from '@/services/api/Api';
import { store } from '@/store';
import useVuelidate from '@vuelidate/core';
import { email, helpers, required, sameAs } from '@vuelidate/validators';

export const useSignUp = () => {
  const initialUser = {
    type: UserTypes.Customer,
    name: '',
    cpf: '',
    birthday: null,
    email: '',
    password: '',
    passwordConfirmation: '',
    address: {
      cep: '',
      street: '',
      complement: '',
      neighbourhood: '',
      number: null,
      state: '',
      city: '',
    }
  }

  const user = ref(initialUser)

  const rules = {
    name: { required },
    cpf: { required },
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
      sameAs: sameAs(computed(() => user.value.password))
    },
    address: {
      cep: { required },
      street: { required },
      complement: { required },
      neighbourhood: { required },
      number: { required },
      state: { required },
      city: { required },
    }
  }

  const v$ = useVuelidate(rules, user)

  const createUser = async (user: User) => {
    const result = await v$.value.$validate()

    if (!result) {
      return false;
    }

    const created = await Api.users.create(user)
    await store.dispatch('saveUser', created)

    return true
  }

  return {
    user,
    createUser,
    v$
  }
}
