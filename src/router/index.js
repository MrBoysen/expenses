import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { async } from '@firebase/util'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/', 
            component: () => import('../views/Home.vue'),
            meta: {
                requiresAuth: true,
            }
        },
        { path: '/expenses', component: () => import('../views/Expenses.vue')},
        { path: '/register', component: () => import('../views/Register.vue')},
        { path: '/signin', component: () => import('../views/SignIn.vue')},
        { path: '/settings', component: () => import('../views/Settings.vue')}
    ]
})

const getCurrentUser = () => {
    return new Promise ((resolve, reject) => {
        const removeListener = onAuthStateChanged(
            getAuth(),
            (user) => {
                removeListener()
                resolve(user)
            }
        )
    })
}

router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (await getCurrentUser()) {
            next()
        } else {
            // alert("You don't have access!")
            next('/signin')
        }
    } else {
        next()
    }
})

export{
    router, getCurrentUser
}