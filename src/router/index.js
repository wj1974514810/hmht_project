import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            name: 'login',
            path: '/login',
            component: () => import('@/views/login.vue')
        },
        {
            name: 'index',
            path: '/index',
            component: () => import('@/views/index.vue')
        }
    ]
})

// 导航守卫， 除了登录页， 其他页面都需要token验证
router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        next()
    } else {
        let token = localStorage.getItem('hmtt_ht_token')
        if (token) {
            next()
        } else {
            next('/login')

        }
    }
})

export default router