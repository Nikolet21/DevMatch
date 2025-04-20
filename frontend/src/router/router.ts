import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'chat/:id?',
          name: 'home-chat',
          component: () => import('../views/ChatView.vue'),
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/developer/:id',
      name: 'developer-profile',
      component: () => import('../views/DeveloperProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('../views/NotificationsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      name: 'DevMatch',
      component: () => import('../views/LandingPageView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/report/:targetId',
      name: 'report',
      component: () => import('../views/ReportView.vue'),
      meta: { requiresAuth: true },
      props: true
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { requiresAuth: false }
    }
  ],
})

// Navigation guard to protect routes
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // Check for stored authentication
  if (!userStore.isAuthenticated) {
    await userStore.checkAuth()
  }

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && userStore.isAuthenticated) {
    next('/home')
  } else {
    next()
  }
})

export default router
