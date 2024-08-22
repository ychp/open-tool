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
    component: () => import('@/components/calander/calendar-conversion/CalendarConversion.vue')
  },
  {
    path: '/timestamp-convert',
    name: 'TimestampConversion',
    component: () => import('@/components/calander/timestamp-conversion/TimestampConversion.vue')
  },
  {
    path: '/number-tool',
    name: 'NumberDeal',
    component: () => import('@/components/number/number-tool/NumberTool.vue')
  },
  {
    path: '/math-calculator',
    name: 'MathCalculator',
    component: () => import('@/components/number/math-calculator/MathCalculator.vue')
  },
  {
    path: '/string-common-utils',
    name: 'StringCommonUtils',
    component: () => import('@/components/string-utils/common-utils/StringCommonUtils.vue')
  },
  {
    path: '/string-join-and-split',
    name: 'StringJoinAndSplit',
    component: () => import('@/components/string-utils/join-and-split/StringJoinAndSplit.vue')
  },
  {
    path: '/text-difference',
    name: 'TextDifference',
    component: () => import('@/components/string-utils/text-difference/TextDifference.vue')
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
  },
  {
    path: '/chrome-extensions',
    name: 'ChromeExtensions',
    component: () => import('@/components/chrome-extensions/ChromeExtensions.vue')
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
