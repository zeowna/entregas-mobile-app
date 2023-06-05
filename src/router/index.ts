import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import SignInPage from '@/views/SignInPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/signIn'
  },
  {
    path: '/signIn',
    component: SignInPage
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/partnerListTab'
      },
      {
        path: 'partnerListTab',
        component: () => import('@/views/PartnersPage.vue'),
      },
      {
        path: 'partnerListTab/partner/:id',
        component: () => import('@/views/PartnerPage.vue')
      },
      {
        path: 'ordersTab',
        component: () => import('@/views/OrdersPage.vue')
      },
      {
        path: 'myDataTab',
        component: () => import('@/views/MyDataPage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
