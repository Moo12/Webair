import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import BlogView from '@/views/BlogView.vue'
import Prices from '@/views/Prices.vue'
import Destinations from '@/views/Destinations.vue'
import DestinationView from '@/views/DestinationView.vue'
import AboutMe from '@/views/AboutMe.vue'
import AdminPanel from '@/views/AdminPanel.vue'
import Login from '@/views/auth/Login.vue'
import Signup from '@/views/auth/Signup.vue'

const routes = [
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPanel,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/blog',
    name: 'Blog',
    component: BlogView
  },
  {
    path: '/prices',
    name: 'Prices',
    component: Prices
  },
  {
    path: '/destinations',
    name: 'Destinations',
    component: Destinations
  },
  {
    path: '/destinations/:id',
    name: 'Destination',
    component: DestinationView,
    props: true // Allows passing `id` as a prop to `Destinations`
  },
  {
    path: '/about-me',
    name: 'AboutMe',
    component: AboutMe,
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  console.log('beforeEach')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  const userAuthorized = true


  if (requiresAuth && !userAuthorized) {
    next('/login'); // Redirect to login if not authenticated
  } else {
    next(); // Allow navigation
  }
});


export default router
