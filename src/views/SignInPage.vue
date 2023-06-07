<template>
  <ion-page>
    <ion-content>
      <form @submit.prevent="signIn">
        <ion-card class="sign-card">
          <ion-card-content>
            <ion-row>
              <ion-col class="ion-text-center">
                <h1>
                  <AppTitle/>
                </h1>
              </ion-col>
            </ion-row>

            <ion-input v-model="credentials.email" placeholder="E-mail"/>
            <input-error :prop="v$.email"/>


            <ion-input placeholder="Senha" type="password" v-model="credentials.password"/>
            <input-error :prop="v$.password"/>

            <ion-button expand="block" type="submit">Entrar</ion-button>

            <br/>

            <ion-row>
              <ion-col class="ion-text-center">
                <a>Esqueci minha senha</a>
              </ion-col>
            </ion-row>
          </ion-card-content>
        </ion-card>
      </form>

      <ion-row>
        <ion-col class="ion-text-right">
          <ion-button color="facebook">
            <ion-icon :icon="logoFacebook" slot="start"/>
            Facebook
          </ion-button>
        </ion-col>
        <ion-col>
          <ion-button color="gmail">
            <ion-icon :icon="logoGoogle" slot="start"/>
            Gmail
          </ion-button>
        </ion-col>
      </ion-row>

      <br/>

      <ion-row>
        <ion-col class="ion-text-center">
          <a id="open-modal">Criar conta com E-mail</a>
        </ion-col>
      </ion-row>

      <SignUpModal trigger="open-modal"/>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonIcon, IonInput, IonPage, IonRow } from '@ionic/vue'
import { logoFacebook, logoGoogle } from 'ionicons/icons';
import AppTitle from '@/components/AppTitle.vue';
import { useSignIn } from '@/composables';
import SignUpModal from '@/views/SignUpModal.vue';
import InputError from '@/components/InputError.vue';

const { credentials, signIn, v$ } = useSignIn()


</script>

<style scoped>

.sign-card {
  margin-top: 30%;
}
</style>
