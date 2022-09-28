<template>
    <div class="level">
        <div class="column container">
            <div class="level-item">
                <h1 class="title level">Create an Account</h1>
            </div>
            <div class="column container is-half">
                <div class="control">
                    <input class="input" type="email" placeholder="Email" v-model="email">
                </div>
            </div>
            <div class="column container is-half">
                <div class="control">
                    <input class="input" type="password" placeholder="Password" v-model="password">
                </div>
            </div>
            <div class="column">
                <div class="has-text-centered">
                    <button class="button is-info" @click="register">Submit</button>
                </div>
                <div class="has-text-centered">
                    <br>
                    <button class="button is-light" @click="signInWithGoogle">Sign in with Google</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref("")
const password = ref("")
const router = useRouter()

const register = () => {
    createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((data) => {
        console.log('Successfully registered!')
        router.push('/')
    })
    .catch((error) => {
        console.log(error.code)
        alert(error.message)
    })
}

const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(getAuth(), provider)
    .then((result) => {
        console.log(result.user)
        router.push('/')
    })
    .catch((error) => {

    })
}


</script>