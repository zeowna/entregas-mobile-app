<template>
  <ion-page>
    <ion-content>
      <form @submit.prevent="signIn">
        <ion-row class="sign-card">
          <ion-col class="ion-text-center">
            <h1>
              <AppTitle/>
            </h1>
          </ion-col>
        </ion-row>

        <ion-card >
          <ion-card-content>
            <ion-input v-model="credentials.email" placeholder="E-mail"/>
            <input-error :prop="v$.email"/>


            <ion-input placeholder="Senha" type="password" v-model="credentials.password"/>
            <input-error :prop="v$.password"/>

            <ion-button expand="block" type="submit">Entrar</ion-button>

            <br/>

            <ion-row>
              <ion-col class="ion-text-center">
                <a @click="forgotPassword">Esqueci minha senha</a>
              </ion-col>
            </ion-row>
          </ion-card-content>
        </ion-card>
      </form>

      <!--      <ion-row>-->
      <!--        <ion-col class="ion-text-right">-->
      <!--          <ion-button color="facebook">-->
      <!--            <ion-icon :icon="logoFacebook" slot="start"/>-->
      <!--            Facebook-->
      <!--          </ion-button>-->
      <!--        </ion-col>-->
      <!--        <ion-col>-->
      <!--          <ion-button color="gmail">-->
      <!--            <ion-icon :icon="logoGoogle" slot="start"/>-->
      <!--            Gmail-->
      <!--          </ion-button>-->
      <!--        </ion-col>-->
      <!--      </ion-row>-->

      <br/>

      <ion-row>
        <ion-col class="ion-text-center">
          <a @click="openSignUpModal">Criar conta com e-mail</a>
        </ion-col>
      </ion-row>

      <SignUpModal :visible="visible" @close="close"/>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonInput, IonPage, IonRow } from '@ionic/vue'
import AppTitle from '@/components/AppTitle.vue';
import { useSignIn } from '@/composables';
import SignUpModal from '@/views/SignUpModal.vue';
import InputError from '@/components/InputError.vue';
import { ref } from "vue";

const { credentials, signIn, forgotPassword, v$ } = useSignIn()
const visible = ref(false)

const openSignUpModal = () => {
  visible.value = true
}

const close = () => {
  visible.value = false
}


</script>

<style scoped>

.sign-card {
  margin-top: 30%;
}
</style>
