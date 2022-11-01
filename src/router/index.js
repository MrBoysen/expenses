import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { async } from '@firebase/util'
import HomeView from '../views/Home.vue'
import ExpensesView from '../views/Expenses.vue'
import RegisterView from '../views/Register.vue'
import SigninView from '../views/SignIn.vue'
import SettingsView from '../views/Settings.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/', 
            name: 'home',
            component: HomeView,
            meta: {
                requiresAuth: true,
            }
        },
        { 
            path: '/expenses', 
            name: 'expenses',
            component: ExpensesView
        },
        { 
            path: '/register', 
            name: 'register',
            component: RegisterView
        },
        { 
            path: '/signin', 
            name: 'signin',
            component: SigninView
        },
        { 
            path: '/settings', 
            name: 'settings',
            component: SettingsView
        }
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