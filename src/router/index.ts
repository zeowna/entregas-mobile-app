import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import SignInPage from '@/views/SignInPage.vue';
import { store } from "@/store";
import { ActionTypes } from "@/store/actions";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/signIn'
  },
  {
    path: '/signIn',
    name: 'signIn',
    component: () => import('@/views/SignInPage.vue')
  },
  {
    path: '/tabs/',
    meta: { requiresAuth: true },
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

router.beforeEach(async (to, from, next) => {
  try {
    await store.dispatch(ActionTypes.REFRESH_TOKEN)

    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (store.getters.getUser) {
        next()
        return
      }
    }

    if (to.name !== 'signIn') {
      next({ name: 'signIn' })
      return
    }

    next()
  } catch (err) {
    console.error(err)
    next({ name: 'signIn' })
  }
})

export default router
