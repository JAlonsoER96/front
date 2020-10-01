import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'
import Articulo from '../components/Articulo.vue'
import Categoria from '../components/Categoria.vue'
import Login from '../components/Login.vue'
import Usuario from '../components/Usuario.vue'
import Cliente from '../components/Cliente.vue'
import Proveedor from '../components/Proveedor.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      administrador: true,
      almacenero: true,
      vendedor: true
    }
  },
  {
    path: '/articulos',
    name: 'Articulo',
    component: Articulo,
    meta: {
      administrador: true,
      almacenero: true
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/categorias',
    name: 'Categoria',
    component: Categoria,
    meta: {
      administrador: true,
      almacenero: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      libre: true
    }
  },
  {
    path: '/usuarios',
    name: 'usuario',
    component: Usuario,
    meta: {
      administrador: true
    }
  },
  {
    path: '/clientes',
    name: 'cliente',
    component: Cliente,
    meta: {
      administrador: true,
      vendedor: true
    }
  },
  {
    path: '/proveedores',
    name: 'proveedor',
    component: Proveedor,
    meta: {
      administrador: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.libre)) {
    next()
  } else if (store.state.usuario && store.state.usuario.rol == "Administrador") {
    if (to.matched.some(record => record.meta.administrador)) {
      next()
    }
  } else if (store.state.usuario && store.state.usuario.rol == "Vendedor") {
    if (to.matched.some(record => record.meta.vendedor))
      next()
  } else if (store.state.usuario && store.state.usuario.rol == "Almacenero") {
    if (to.matched.some(record => record.meta.almacenero))
      next()
  } else {
    next({ name: 'login' })
  }
})
export default router
