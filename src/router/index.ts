import { createRouter, createWebHistory } from 'vue-router'

const routers = [
  {
    path: '/',
    name: 'Homepage',
    component: () => import('@/components/homepage/HomePage.vue')
  },
  {
    path: '/calendar-convert',
    name: 'CalendarConversion',
    component: () => import('@/components/calander/CalendarConversion/CalendarConversion.vue')
  },
  {
    path: '/timestamp-convert',
    name: 'TimestampConversion',
    component: () => import('@/components/calander/TimestampConversion/TimestampConversion.vue')
  },
  {
    path: '/mahjong-score',
    name: 'MahjongScoreCalculator',
    component: () =>
      import('@/components/amusement/MahjongScoreCalculator/MahjongScoreCalculator.vue')
  },
  {
    path: '/holiday-lookup',
    name: 'HolidayLookup',
    component: () => import('@/components/error/NotSupport.vue')
  },
  {
    path: '/generate-by-table',
    name: 'GenerateByTable',
    component: () => import('@/components/error/NotSupport.vue')
  },
  {
    path: '/generate-by-sql',
    name: 'GenerateBySQL',
    component: () => import('@/components/error/NotSupport.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Main.vue'),
      children: routers
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/components/error/NotFound.vue')
    }
  ]
})

export default router
