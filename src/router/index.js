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
            component: () => import('@/views/index.vue'),
            // redirect路由重定向  使用name来映射  登录index后 先展示hellow界面
            redirect: { name: 'hellow' },
            // 嵌套路由
            children: [
                {
                    name: 'hellow',
                    path: 'hellow',
                    component: () => import('@/views/hellow.vue'),
                },
                {
                    name: 'postList',
                    path: 'postList',
                    component: () => import('@/views/postList.vue'),
                },
                {
                    name: 'postPubLish',
                    path: 'postPubLish',
                    component: () => import('@/views/postPubLish.vue'),
                }
            ]
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