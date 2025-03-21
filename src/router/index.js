import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Dashboard from '../components/Dashboard.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const authPages = ['/login', '/register'];

  if (!token && to.path === '/dashboard') {
    next('/login');
  } else if (token && authPages.includes(to.path)) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
