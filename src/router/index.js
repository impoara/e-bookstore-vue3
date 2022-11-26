import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login/login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Home/home.vue')
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('../views/Cart/cart.vue')
  },
  {
	path: '/pay',
	name: 'pay',
	component: () => import('../views/Pay/pay.vue')
  },
  {
  	path: '/orders',
  	name: 'orders',
  	component: () => import('../views/Orders/orders.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// router.beforeEach(to, from, next){
//   next()
// }

export default router
