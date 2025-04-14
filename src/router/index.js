import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import Destinations from '@/views/Destinations.vue'
import BlogView from '@/views/BlogView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/blog',
    name: 'Blog',
    component: BlogView
  },
  {
    path: '/destinations',
    name: 'Destinations',
    component: Destinations,
    props: route => ({
      id: route.query.id,
    }),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
