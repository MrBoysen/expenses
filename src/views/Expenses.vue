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
		<h1  @click="hiddenExpenses = !hiddenExpenses">Expenses</h1>
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
	
	<div v-for="expense in expenses" :key="expense.id" class="card mb-3">
		<div class="card-content level">
			<div class="content level-item">
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
	import { ref, onMounted } from 'vue'
	import { collection, doc, onSnapshot, addDoc, deleteDoc, updateDoc } from 'firebase/firestore'
	import { db } from '@/firebase'
import { slotFlagsText } from '@vue/shared';

	// Firebase refs
	const expensesCollectionRef = collection(db, 'expenses')
	
	const hiddenExpenses = ref(true)

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
					amount: doc.data().amount,
					isEdit: doc.data().isEdit
				}
				fbExpenses.push(expense)
			})
			expenses.value = fbExpenses

			// Get the total of all expenses
			let sumAmount = 0
			expenses.value.forEach((item, index) => {
				// sumAmount.push(item.amount)
				sumAmount += item.amount
			}) 
			console.log(sumAmount);
			// const sumAmount = Amount.reduce((a, b) => a + b, 0)
		})
	})
	
    // Add Expense
    const newCompany = ref('')
    const newType = ref('')
    const newAmount = ref('')
	const newIsEdit = ref(false)
    
    const addExpense = () => {
		addDoc(expensesCollectionRef, {
			company: newCompany.value,
			type: newType.value,
			amount: parseInt(newAmount.value),
			isEdit: newIsEdit.value
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
					amount: expense.amount,
					company: expense.company,
					type: expense.type,
					isEdit: expense.isEdit
				})
			}
		} else {
			!expense.isEdit == expense.isEdit
		}
	}

	const updateExpense = (id) => {
		console.log(id);
		updateDoc(doc(expensesCollectionRef, id), {
			company,
			type,
			amount
		})
	}
	
</script>


<style scoped>
h1 {
	text-align: center;
	font-size: 2rem;
	font-weight: 700;
}
</style>