<template>
  <ion-modal ref="modal" :trigger="trigger">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="close">Voltar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <form @submit.prevent="createUserAndSignIn">

        <ion-card>
          <ion-card-header>
            <ion-card-title>
              <AppTitle/>
            </ion-card-title>
          </ion-card-header>

          <ion-card-content>

            <ion-label position="stacked">Nome</ion-label>
            <ion-input v-model="user.name" type="text" placeholder="Seu nome" aria-label="Nome"/>
            <input-error :prop="v$.name"/>
            <ErrorMessage name="name"/>

            <ion-label position="stacked">CPF</ion-label>
            <ion-input v-model="user.cpf" type="text" placeholder="Seu CPF" aria-label="CPF" maxlength="11"/>
            <input-error :prop="v$.cpf" :error="errorsFromRequest?.cpf"/>


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
            <input-error :prop="v$.birthday" :error="errorsFromRequest?.birthday"/>

          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-content>
            <ion-label position="stacked">E-mail</ion-label>
            <ion-input v-model="user.email" type="text" placeholder="Seu E-mail" aria-label="E-mail"/>
            <input-error :prop="v$.email" :error="errorsFromRequest?.email"/>


            <ion-label position="stacked">Senha</ion-label>
            <ion-input v-model="user.password" type="password" placeholder="Sua Senha" aria-label="Senha"/>
            <input-error :prop="v$.password"/>


            <ion-label position="stacked">Confirmar Senha</ion-label>
            <ion-input v-model="user.passwordConfirmation" type="password" placeholder="Confirme sua Senha"
                       aria-label="Confirmar Senha"/>
            <input-error :prop="v$.passwordConfirmation"/>

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
  IonToolbar
} from '@ionic/vue'
import { computed, ref } from 'vue';
import { useSignIn, useSignUp } from '@/composables';
import AppTitle from '@/components/AppTitle.vue';
import { DateTime } from 'luxon';
import InputError from '@/components/InputError.vue';

defineProps<{ trigger: string }>()

const modal = ref()
const formattedBirthday = computed(
    () => user.value?.birthday
        ? DateTime.fromISO(user.value?.birthday as string).toLocaleString()
        : ''
)
const presentBirthday = ref(false)

const close = () => {
  modal.value.$el.dismiss()
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
