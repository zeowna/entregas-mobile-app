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
      <form>
        <ion-card>
          <ion-card-header>
            <ion-card-title>Dados Pessoais</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-label position="stacked">E-mail</ion-label>
            <ion-input v-model="user.email" type="email" placeholder="Seu E-mail" aria-label="E-mail"/>
            <ion-button expand="block" type="submit">Editar</ion-button>
          </ion-card-content>
        </ion-card>
      </form>

      <form>
        <ion-card>
          <ion-card-header>
            <ion-card-title>Dados de Acesso</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div v-if="showPasswordFields">
              <ion-label position="stacked">Senha</ion-label>
              <ion-input v-model="user.password" type="password" placeholder="Sua Senha" aria-label="Senha"/>

              <ion-label position="stacked">Confirmar Senha</ion-label>
              <ion-input v-model="user.password" type="password" placeholder="Confirme sua Senha"
                         aria-label="Confirmar Senha"/>
            </div>
            <ion-button v-if="!showPasswordFields" expand="block" type="button" @click="showPasswordFields = true">
              Alterar Senha
            </ion-button>
            <ion-button v-if="showPasswordFields" expand="block" type="submit">Salvar</ion-button>
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
  IonHeader,
  IonInput,
  IonLabel,
  IonModal,
  IonToolbar,
} from '@ionic/vue'
import { onMounted, ref } from 'vue';
import { store } from '@/store';

defineProps<{ trigger: string }>()

const modal = ref()

const user = ref({})

const close = () => {
  modal.value.$el.dismiss()
}

const showPasswordFields = ref(false)

onMounted(() => {
  showPasswordFields.value = false
  user.value = store.state.user! ?? {}
})
</script>
