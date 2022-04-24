import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../views/web/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/index',
    redirect: '/stucompla/index'
  },
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/refresh',
    name: 'refresh',
    component: () => import('../views/web/refresh')
  },
  {
    path: '/stucompla',
    name: 'home',
    component: () => import('../views/web/Home'),
    children: [
      {
        path: 'index',
        name: 'index',
        component: index
      },
      {
        path: 'forum',
        name: 'forum',
        component: () => import('../views/web/forum.vue')
        // children: [
        //   {
        //     path: 'publishPost',
        //     name: 'publishPost',
        //     component: () => import('../views/web/publishPost')
        //   }
        // ]
      },
      {
        path: 'createPost',
        name: 'createPost',
        component: () => import('../views/web/createPost')
      },
      {
        path: 'editPost/:id',
        name: 'editPost',
        component: () => import('../views/web/editPost')
      },
      {
        path: 'myCenter',
        name: 'myCenter',
        component: () => import('../views/web/myCenter')
      },
      {
        path: 'post/:id',
        name: 'postDetail',
        component: () => import('../views/web/postDetail.vue')
      },
      {
        path: 'wall',
        name: 'wall',
        component: () => import('../views/web/wall.vue')
      },
      {
        path: 'market',
        name: 'market',
        component: () => import('../views/web/market.vue')
      },
      {
        path: 'createGoods',
        name: 'createGoods',
        component: () => import('../views/web/createGoods')
      },
      {
        path: 'editGoods/:id',
        name: 'editGoods',
        component: () => import('../views/web/editGoods')
      },
      {
        path: 'goods/:id',
        name: 'goodsDetail',
        component: () => import('../views/web/goodsDetail')
      }
    ]
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/web/admin.vue')
  },
  {
    path: '/forum',
    name: 'forum',
    component: () => import('../views/web/forum.vue')
  },
  // {
  //   path: '/post/:id',
  //   name: 'postDetail',
  //   component: () => import(/* webpackChunkName: "newsDetail" */ '../views/web/postDetail.vue')
  // },
  {
    path: '/wall',
    name: 'wall',
    component: () => import('../views/web/wall.vue')
  },
  {
    path: '/market',
    name: 'market',
    component: () => import('../views/web/market.vue')
  },
  {
    path: '/news',
    name: 'news',
    component: () => import(/* webpackChunkName: "news" */ '../views/web/news.vue')
  },
  {
    path: '/news/:id',
    name: 'newsDetail',
    component: () => import(/* webpackChunkName: "newsDetail" */ '../views/web/newsDetail.vue')
  },
  {
    path: '/product',
    name: 'product',
    component: () => import(/* webpackChunkName: "product" */ '../views/web/product.vue')
  },
  {
    path: '/job',
    name: 'job',
    component: () => import(/* webpackChunkName: "job" */ '../views/web/job.vue')
  },
  {
    path: '/job/:id',
    name: 'jobDetail',
    component: () => import(/* webpackChunkName: "jobDetail" */ '../views/web/jobDetail.vue')
  },
  // {
  //   path: '/customer',
  //   name: 'customer',
  //   component: customer
  // },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/web/login.vue')
  },
  // {
  //   path: '/signup',
  //   name: 'signup',
  //   component: signup
  // },
  {
    path: '*',
    redirect: '/'
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  // 网站统计
  /* eslint-disable */
  if (_hmt) {
    if (to.path) {
      _hmt.push(['_trackPageview', to.fullPath])
    }
  }
  next()
  /* eslint-enable */
})
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})
export default router
