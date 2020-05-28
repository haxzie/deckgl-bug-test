
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    linkActiveClass: 'set-active',
    routes: [
        {
            path: '/',
            component: () => import('../components/PathMap')
        },
        { // redirect everything else to home
            path: '*',
            redirect: '/',
        },
    ]
});

export default router;