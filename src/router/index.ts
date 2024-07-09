import { createRouter, createWebHistory } from 'vue-router'
import NotFound from '@/components/error/404.vue'
import Main from '@/views/Main.vue'

const routers = [
  {
    path: '/',
    name: 'Homepage',
    component: () => import('@/components/homepage/HomePage.vue')
  },
  {
    path: '/CalendarConversion',
    name: 'CalendarConversion',
    component: () => import('@/components/calander/CalendarConversion/CalendarConversion.vue')
  },
  {
    path: '/TimestampConversion',
    name: 'TimestampConversion',
    component: () => import('@/components/calander/TimestampConversion/TimestampConversion.vue')
  },
  {
    path: '/MahjongScoreCalculator',
    name: 'MahjongScoreCalculator',
    component: () =>
      import('@/components/amusement/MahjongScoreCalculator/MahjongScoreCalculator.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Main,
      children: routers
    },
    {
      path: '/:pathMatch(.*)*',
      component: NotFound
    }
  ]
})

export default router
