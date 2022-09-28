<template>
    <div class="level">
        <div class="column container">
            <!-- <form> -->
            <div class="level-item">
                <h1 class="title level">Log in</h1>
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
                <p v-if="errMsg">{{ errMsg }}</p>
            </div>
            <div class="column">
                <div class="has-text-centered">
                    <button class="button is-info" @click="logIn">Submit</button>
                </div>
                <div class="has-text-centered">
                    <br>
                    <button class="button is-light" @click="signInWithGoogle">Sign in with Google</button>
                </div>
            </div>
            <!-- </form> -->
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref("")
const password = ref("")
const errMsg = ref()
const router = useRouter()

const logIn = () => {
    signInWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((data) => {
        console.log('Successfully logged in!')
        router.push('/')
    })
    .catch((error) => {
        console.log(error.code)
        switch (error.code) {
            case 'auth/invalid-email':
                errMsg.value = 'Invalid email'
                break
            case 'auth/user-not-found':
                errMsg.value = 'No Account with that email was found'
                break
            case 'auth/wrong-password':
                errMsg.value = 'Incorrect password'
                break
            default:
                errMsg.value = 'Email or password was incorrect'
                break
        }
        // alert(errMsg.value)
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