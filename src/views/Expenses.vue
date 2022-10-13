<template>
	<div class="expenses-app">
	<div class="columns">
	<!-- Add filter to this input field -->
		<div class="column">
			<input
			class="input field mb-3 column is-half is-offset-one-quarter"
			type="text"
			placeholder="Search">
		</div>
	</div>
		<h1>Expenses</h1>
		<form
		@submit.prevent="addExpense"
		class="columns">
			<div class="column is-half is-offset-one-quarter">
				<input
				v-model="newCompany"
				class="input field"
				type="text"
				placeholder="Company">
				<input
				v-model="newType"
				class="input field"
				type="text"
				placeholder="Type">
				<input
				v-model="newAmount"
				class="input field"
				type="text"
				placeholder="Amount">
				<div class="level-item">
					<button @click="addExpense"
					:disabled="!newCompany || !newType || !newAmount"
					type="submit"
					class="button is-info ml-2 button-add">Add</button>
				</div>
			</div>
		</form>
	
	<div v-for="expense in expenses" :key="expense.id" class="card mb-3">
		<div class="card-content level">
			<div class="content level-item">
				<div class="column">
					{{ expense.company }}
				</div>
				<div class="column">
					{{ expense.type }}
				</div>
				<div class="column">
					{{ expense.amount }}
				</div>
				<div class="column has-text-right">
					<button
					@click="deleteExpense(expense.id)"
					class="button is-danger">&cross;</button>
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script setup>
	import { ref, onMounted } from 'vue'
	import { collection, doc, onSnapshot, addDoc, deleteDoc } from 'firebase/firestore'
	import { db } from '@/firebase'

	// Firebase refs
	const expensesCollectionRef = collection(db, 'expenses')
	
	// Expenses
	const expenses = ref([])

	// Get Expenses

	onMounted(() => {
		onSnapshot(expensesCollectionRef, (querySnapshot) => {
			const fbExpenses = []
			querySnapshot.forEach((doc) => {
				const expense = {
					id: doc.id,
					company: doc.data().company,
					type: doc.data().type,
					amount: doc.data().amount
				}
				fbExpenses.push(expense)
			})
			expenses.value = fbExpenses
		})
	})
	
    // Add Expense
    const newCompany = ref('')
    const newType = ref('')
    const newAmount = ref('')
    
    const addExpense = () => {
		addDoc(expensesCollectionRef, {
			company: newCompany.value,
			type: newType.value,
			amount: newAmount.value
		})
	// Clear form after add
	newCompany.value = ''
	newType.value = ''
	newAmount.value = ''
	}

	// Delete Expense
	const deleteExpense = id => {
		deleteDoc(doc(expensesCollectionRef, id))
	}
</script>


<style scoped>
h1 {
	text-align: center;
	font-size: 2rem;
	font-weight: 700;
}
</style>