<template>
  <ion-modal :isOpen="visible">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="close">Voltar</ion-button>
        </ion-buttons>
        <ion-title>
          <AppTitle />
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <form @submit.prevent="updateEmail">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Dados Pessoais</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-label position="stacked">E-mail</ion-label>
            <ion-input v-model="(v$ as any).email.$model" placeholder="Seu E-mail" aria-label="E-mail" />
            <input-error :prop="(v$ as any).email" />
            <ion-button expand="block" type="submit">Editar</ion-button>
          </ion-card-content>
        </ion-card>
      </form>

      <ion-card>
        <ion-card-header>
          <ion-card-title>Dados de Acesso</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form @submit.prevent="updatePassword">
            <div v-if="showPasswordFields">
              <ion-label position="stacked">Senha</ion-label>
              <ion-input v-model="(v$Password as any).password.$model" type="password" placeholder="Sua Senha"
                aria-label="Senha" />
              <input-error :prop="(v$Password as any).password" />

              <ion-label position="stacked">Confirmar senha</ion-label>
              <ion-input v-model="(v$Password as any).passwordConfirmation.$model" type="password"
                placeholder="Confirme sua Senha" aria-label="Confirmar Senha" />
              <input-error :prop="(v$Password as any).passwordConfirmation" />

            </div>
            <ion-button v-if="!showPasswordFields" expand="block" type="button" @click="showPasswordFields = true">
              Alterar Senha
            </ion-button>
            <ion-button v-if="showPasswordFields" expand="block" type="submit">Salvar</ion-button>
          </form>
        </ion-card-content>
      </ion-card>

    </ion-content>
  </ion-modal>
</template>

<script lang="ts" setup>
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonLabel,
  IonModal,
  IonToolbar,
alertController,
loadingController,
} from '@ionic/vue'
import { computed, onMounted, Ref, ref } from 'vue';
import { store } from '@/store';
import { Api } from "@/services/api/Api";
import { CustomerUser } from "@/services/api/types";
import { email, helpers, required, sameAs } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import InputError from "@/components/InputError.vue";
import AppTitle from "@/components/AppTitle.vue";

const emit = defineEmits(['close'])
defineProps({
  visible: { type: Boolean, default: false }
})

const user = ref<CustomerUser>()

const rules = computed(() => ({
  email: {
    required: helpers.withMessage('E-mail é obrigatório', required),
    email: helpers.withMessage('E-mail precisa ser um e-mail', email),
  },
}))

const v$ = useVuelidate(rules, user as Ref<CustomerUser>)

const rulesPassword = computed(() => ({
  password: {
    required: helpers.withMessage('Senha é obrigatório', required),
  },
  passwordConfirmation: {
    required: helpers.withMessage('Confirmar senha é obrigatório', required),
    sameAs: helpers.withMessage('Confirmar senha precisa coincidir com Senha', sameAs(user?.value?.password ?? ''))
  }
}))

const v$Password = useVuelidate(rulesPassword, user as Ref<CustomerUser & { passwordConfirmation: string }>)

const close = () => {
  emit('close')
}

const showPasswordFields = ref(false)

const updateEmail = async () => {
  const loading = await loadingController.create({ message: 'Salvando...' })

  const valid = await v$.value.$validate()


  try {
    await loading.present()

    if (user.value && valid) {
    await Api.me.update(user.value)
  }
  } catch (err) {
    const alert = await alertController.create({ header: 'Erro ao salvar e-mail', buttons: ['Ok'] })
    await alert.present()
  } finally {
    await loading.dismiss()
  }
}

const updatePassword = async () => {
  const loading = await loadingController.create({ message: 'Salvando...' })


  const valid = await v$Password.value.$validate()

  try {
    await loading.present()

    if (user.value && valid) {
      await Api.me.updateMyPassword(user.value.password!)
    }
  } catch (err) {
    const alert = await alertController.create({ header: 'Erro ao salvar senha', buttons: ['Ok'] })
    await alert.present()
  } finally {
    await loading.dismiss()
  }
}

onMounted(() => {
  showPasswordFields.value = false
  user.value = store.getters.getUser
})
</script>
