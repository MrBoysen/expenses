<template>
	<div class="expenses-app">
		<form
	  @submit.prevent="addExpense"
	  class="field">
	  <div class="field is-grouped">
		  <input
		  v-model="newCompany"
		  class="input"
		  type="text"
		  placeholder="Company">
		  <input
		  v-model="newType"
		  class="input ml-2"
		  type="text"
		  placeholder="Type">
		  <input
		  v-model="newAmount"
		  class="input ml-2"
		  type="text"
		  placeholder="Amount">
		  <button @click="addExpense"
		  :disabled="!newCompany || !newType || !newAmount"
		  class="button is-info ml-2">Add</button>
		</div>
	</form>
	<div>
	  <!-- Add filter to this input field -->
	  <input
	  
	  class="input mb-3"
	  type="text"
	  placeholder="Search">
	</div>
	
	<div v-for="expense in expenses" :key="expense.id" class="card mb-3">
		<div class="card-content">
			<div class="content columns is-mobile is-vcentered">
				<div class="column">
					{{ expense.content.company }}
				</div>
				<div class="column">
					{{ expense.content.type }}
				</div>
				<div class="column">
					{{ expense.content.amount }}
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
	import { v4 as uuidv4 } from 'uuid'
	// import { collection, getDocs } from 'firebase/firestore'
	// import { db } from '@/firebase'
	// import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'

	// Expenses
	const expenses = ref([
	{
		id: uuidv4(),
		content: {
		company: 'Tibber',
		type: 'El',
		amount: 1234
		}	
	},
	{
		id: uuidv4(),
		content: {
		company: 'EON',
		type: 'El',
		amount: 902
		}
	}
	])

    // Add Expense
    const newCompany = ref('')
    const newType = ref('')
    const newAmount = ref('')
    
    const addExpense = () => {
		const newExpense = {
			id: uuidv4(),
        	content: {
				company: newCompany.value,
				type: newType.value,
				amount: newAmount.value
			}
		}
	expenses.value.push(newExpense)
	// Clear form after add
	newCompany.value = ''
	newType.value = ''
	newAmount.value = ''
	}

	// Delete Expense
	const deleteExpense = id => {
		expenses.value = expenses.value.filter(expense => expense.id !== id)
	}
</script>