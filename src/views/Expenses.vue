<template>
	<div class="expenses-app">
		<form
		class="columns"
		@submit.prevent=""
		>
		<!-- Add filter to this input field -->
			<div class="column is-half is-offset-one-quarter">
				<input
				class="input field"
				type="text"
				placeholder="Search (Not active yet)">
			</div>
		</form> 
		<div></div>
			<h1 class="add" @click="hiddenExpenses = !hiddenExpenses">Expenses</h1>
		<form
			v-if="!hiddenExpenses"
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
		<div class="card mb-3">
			<div class="card">
				<div class="column"><b>Total: {{ totalCost }} SEK</b></div>
				<div class="card-content level">
					<div class="content level-item">
						<div class="column"><b><u>Datum</u></b></div>
						<div class="column"><b><u>Företag</u></b></div>
						<div class="column"><b><u>Typ</u></b></div>
						<div class="column"><b><u>Pris</u></b></div>
						<div class="column"></div>
					</div>
				</div>
			</div>
			<div v-for="expense in filteredExpenses" :key="expense.id" class="card-content ">
				<div class="content level-item">
					<div class="column" v-if="!expense.isEdit">
						{{ expense.createdAt }}
					</div>
					<div class="column" v-if="!expense.isEdit">
						{{ expense.company }}
					</div>
					<div class="column" v-else>
						<input v-model="expense.company" type="text"/>
					</div>
					<div class="column" v-if="!expense.isEdit">
						{{ expense.type }}
					</div>
					<div class="column" v-else>
						<input v-model="expense.type" type="text">
					</div>
					<div class="column" v-if="!expense.isEdit">
						{{ expense.amount }} Kr
					</div>
					<div class="column" v-else>
						<input v-model="expense.amount" type="text">
					</div>
					<div class="column has-text-right">
						<button
						@click="editExpense(expense, id)"
						class="button is-success mr-2">&star;</button>
						<button
						@click="editExpense(expense, id)"
						class="button is-info mr-2">&dash;</button>
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
	import { ref, onMounted, onBeforeUpdate, onUpdated, onBeforeMount } from 'vue'
	import { collection, doc, onSnapshot, addDoc, deleteDoc, updateDoc } from 'firebase/firestore'
	import { getAuth, onAuthStateChanged } from 'firebase/auth'
	import { db } from '@/firebase'
	import { getCurrentUser } from '../router';
	import moment from 'moment'


	// Firebase refs
	const expensesCollectionRef = collection(db, 'expenses')

	const hiddenExpenses = ref(true)
	
	// Expenses
	const expenses = ref([])
	const filteredExpenses = ref([])
	const totalCost = ref([])
	
	// Get Expenses
	onMounted(async () => {
		// const user = await getCurrentUser()
		// console.log(user);

		onSnapshot(expensesCollectionRef, async (querySnapshot) => {
			const user = await getCurrentUser()
			const fbExpenses = []
			querySnapshot.forEach((doc) => {
					const expense = {
						id: doc.id,
						company: doc.data().company,
						type: doc.data().type,
						amount: doc.data().amount,
						isEdit: doc.data().isEdit,
						userid: doc.data().userid,
						createdAt: doc.data().createdAt
					}
					fbExpenses.push(expense)
			})
			expenses.value = fbExpenses

			const fExpenses = []
			expenses.value.forEach((item, index) => {
				if (item.userid === user.uid) {
					const expense = {
						id: item.id,
						company: item.company,
						type: item.type,
						amount: item.amount,
						isEdit: item.isEdit,
						createdAt: item.createdAt
					}
					fExpenses.push(expense)
				}
			})
			filteredExpenses.value = fExpenses
		})
	})

	onUpdated(() => {
		// Get the total of all expenses
		const cost = []

		filteredExpenses.value.forEach((item, index) => {
			cost.push(item.amount)
		}) 

		const sumCost = cost.reduce((a, b) => a + b, 0)

		totalCost.value = sumCost

	})

	// Add Expense
	const newCompany = ref('')
	const newType = ref('')
	const newAmount = ref('')
	const newIsEdit = ref(false)
    
	const addExpense = async () => {
		const user = await getCurrentUser()
		addDoc(expensesCollectionRef, {
			company: newCompany.value,
			type: newType.value,
			amount: parseInt(newAmount.value),
			isEdit: newIsEdit.value,
			userid: user.uid,
			createdAt: moment().format('D MMM, YYYY'),
			recurring: true,
			interval: 0
			
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

	const editExpense = async (expense) => {
		// console.log(expense);
		if (expense.id.value === expense.id.value) {
			expense.isEdit = !expense.isEdit
			if (!expense.isEdit) {
				await updateDoc(doc(expensesCollectionRef, expense.id), {
					amount: parseInt(expense.amount),
					company: expense.company,
					type: expense.type,
					isEdit: expense.isEdit
				})
			}
		} else {
			!expense.isEdit == expense.isEdit
		}
	}

</script>


<style scoped>
h1 {
	text-align: center;
	font-size: 2rem;
	font-weight: 700;
}

.add:hover {
	cursor: pointer;
}

.card-content {
	padding: 0;
}
</style>