<template>
<section>
	<nav class="navbar is-active" role="navigation" aria-label="main navigation">
	<div id="navbarBasicExample" class="navbar-menu is-active">
		<div class="navbar-start">
			<router-link class="navbar-item" to="/"> Home </router-link>
			<router-link class="navbar-item" to="/settings"> Settings </router-link>
		</div>

		<div class="navbar-end">
			<div class="navbar-item">
				<div class="buttons">
					<router-link class="is-info button navbar-item" v-if="!isLoggedIn" to="/register"> Register </router-link>
					<router-link class="is-primary button navbar-item" v-if="!isLoggedIn" to="/signin"> Log in </router-link>
					<button class="button is-danger" @click="handleSignOut" v-if="isLoggedIn">Logout</button>
				</div>
			</div>
		</div>
	</div>
</nav>
<router-view />    
</section>
</template>

<script setup>
	// Imports
	import { ref, onMounted, onBeforeMount } from 'vue'
	// import { v4 as uuidv4 } from 'uuid'
	import { collection, getDocs } from 'firebase/firestore'
	import { db } from '@/firebase'
	import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
	import { useRouter, useRoute } from 'vue-router'

	const router = useRouter()
	const route = useRoute()

	// let auth
	// onBeforeMount(() => {
	// 	auth = getAuth()
	// 	onAuthStateChanged(auth, (user) => {
	// 		console.log(user)
	// 		if (!user) {
	// 			router.replace('/register')
	// 		} else if (route.path == '/signin' || route.path == '/register') {
	// 			router.replace('/')
	// 		}
	// 	})
	// })
    
    // Get Expenses
    onMounted(async () => {
		const querySnapshot = await getDocs(collection(db, 'expenses'))
      querySnapshot.forEach((doc) => {
		  console.log(doc.id, " => ", doc.data())
      })
    })

	let auth
	onMounted(() => {
		auth = getAuth()
	onAuthStateChanged(auth, (user) => {
		if (user) {
			isLoggedIn.value = true
			router.replace('/')
		} else {
			isLoggedIn.value = false
		}
	})
	})
	// Logout
	const isLoggedIn = ref(false)
	const handleSignOut = () => {
		signOut(auth).then(() => {
			router.push('/signin')
	})
	}


</script>

<style>
	@import 'bulma/css/bulma.min.css';

.expenses-app {
	padding: 20px;
	margin: 0 auto;
}

</style>