<template>
  <ion-modal :isOpen="visible">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="close">Voltar</ion-button>
        </ion-buttons>
        <ion-title>
          <AppTitle/>
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <form @submit.prevent="createUserAndSignIn">
        <ion-card>
          <ion-card-header>
            <ion-card-title>
              Cadastro
            </ion-card-title>
          </ion-card-header>

          <ion-card-content>

            <ion-label position="stacked">Nome</ion-label>
            <ion-input v-model="user.name" type="text" placeholder="Seu nome" aria-label="Nome"/>
            <input-error :prop="(v$ as any).name"/>

            <ion-label position="stacked">CPF</ion-label>
            <ion-input v-model="user.cpf" type="text" placeholder="Seu CPF" aria-label="CPF" :maxlength="11"/>
            <input-error :prop="(v$ as any).cpf" :error="errorsFromRequest?.cpf"/>


            <ion-label position="stacked">Data de Nascimento</ion-label>
            <br v-show="!presentBirthday"/>
            <br v-show="!presentBirthday"/>
            <ion-input v-show="!presentBirthday && user.birthday" :value="formattedBirthday"
                       aria-label="Data de Nascimento" disabled/>
            <ion-button v-show="!presentBirthday" size="small" color="danger" @click="presentBirthday = true">
              Selecionar
            </ion-button>
            <ion-datetime v-model="user.birthday" v-show="presentBirthday" presentation="date" id="birthday"/>
            <ion-button v-show="presentBirthday" size="small" color="danger" @click="presentBirthday = false">
              Ok
            </ion-button>
            <br/>
            <input-error :prop="(v$ as any).birthday" :error="errorsFromRequest?.birthday"/>

          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-content>
            <ion-label position="stacked">E-mail</ion-label>
            <ion-input v-model="user.email" type="text" placeholder="Seu E-mail" aria-label="E-mail"/>
            <input-error :prop="(v$ as any).email" :error="errorsFromRequest?.email"/>


            <ion-label position="stacked">Senha</ion-label>
            <ion-input v-model="user.password" type="password" placeholder="Sua Senha" aria-label="Senha"/>
            <input-error :prop="(v$ as any).password"/>


            <ion-label position="stacked">Confirmar Senha</ion-label>
            <ion-input v-model="user.passwordConfirmation" type="password" placeholder="Confirme sua Senha"
                       aria-label="Confirmar Senha"/>
            <input-error :prop="(v$ as any).passwordConfirmation"/>

            <br/>

            <ion-button expand="block" type="submit">Criar minha conta</ion-button>

          </ion-card-content>
        </ion-card>
      </form>

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
  IonDatetime,
  IonHeader,
  IonInput,
  IonLabel,
  IonModal,
  IonTitle,
  IonToolbar
} from '@ionic/vue'
import { computed, ref } from 'vue';
import { useSignIn, useSignUp } from '@/composables';
import AppTitle from '@/components/AppTitle.vue';
import { DateTime } from 'luxon';
import InputError from '@/components/InputError.vue';

defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const formattedBirthday = computed(
    () => user.value?.birthday
        ? DateTime.fromISO(user.value?.birthday as string).toLocaleString()
        : ''
)

const presentBirthday = ref(false)

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}


const { user, createUser, v$, errorsFromRequest } = useSignUp()
const { credentials, signIn } = useSignIn()

const createUserAndSignIn = async () => {
  if (await createUser()) {
    credentials.value = {
      email: user.value.email,
      password: user.value.password as string
    }

    await signIn()
    await close()
  }
}

</script>
