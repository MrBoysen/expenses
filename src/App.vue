<template>
<section>
	<nav class="navbar is-active" role="navigation" aria-label="main navigation">
	<div id="navbarBasicExample" class="navbar-menu is-active">
		<div class="navbar-start">
			<router-link class="navbar-item" to="/" v-if="isLoggedIn"> Home </router-link>
			<router-link class="navbar-item" to="/expenses" v-if="isLoggedIn"> Expenses </router-link>
			<router-link class="navbar-item" to="/settings" v-if="isLoggedIn"> Settings </router-link>
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
	import { ref, onMounted } from 'vue'
	import { db } from '@/firebase'
	import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
	import { useRouter, useRoute } from 'vue-router'

	const router = useRouter()
	const route = useRoute()

	let auth
	onMounted(() => {
		auth = getAuth()
	onAuthStateChanged(auth, (user) => {
		if (user) {
			isLoggedIn.value = true
			router.replace('/expenses')
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