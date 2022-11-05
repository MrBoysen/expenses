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
		<div class="columns">
			<button class="month-btn column">Jan</button>
			<button class="month-btn column">Feb</button>
			<button class="month-btn column">Mar</button>
			<button class="month-btn column">Apr</button>
			<button class="month-btn column">May</button>
			<button class="month-btn column">Jun</button>
			<button class="month-btn column">Jul</button>
			<button class="month-btn column">Aug</button>
			<button class="month-btn column">Sep</button>
			<button class="month-btn column">Oct</button>
			<button class="month-btn column">Nov</button>
			<button class="month-btn column">Dec</button>
		</div>
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
				v-model.number="newAmount"
				class="input field"
				type="number"
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
						<div class="column"><b><u>Date</u></b></div>
						<div class="column"><b><u>Company</u></b></div>
						<div class="column"><b><u>Type</u></b></div>
						<div class="column"><b><u>Amount</u></b></div>
						<div class="column"></div>
					</div>
				</div>
			</div>
			<div v-for="expense in filteredExpenses" :key="expense.id" class="card-content ">
				<div class="content level-item">
					<div class="column" v-if="!expense.isEdit">
						{{ expense.createdAt }}
					</div>
					<div class="column" v-else>
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
						<input v-model.number="expense.amount" type="number">
					</div>
					<div class="column has-text-right">
						<button :class="{active: expense.recurring}"
						@click="makeRecurring(expense, id)"
						class="button mr-2">&star;</button>
						<button
						@click="editExpense(expense, id)"
						class="button is-info is-focused mr-2">&#9998;</button>
						<button
						@click="deleteExpense(expense.id)"
						class="button is-danger">&cross;</button>
						<Teleport to="body">
							<Modal :show="showModal" @close="showModal = false" class="modal" id="modal">
								<template #header>
									<div class="title">Set bill recurrence</div>
									<button @click="setInterval(expense, id)" class="modal-default-button">&cross;</button>
								</template>
								<template #body>
									<input v-model.number="interval" class="input" type="text" placeholder="Number of month per year 12, 6, 3, 1">
								</template>
							</Modal>
						</Teleport>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted, onUpdated} from 'vue'
	import { collection, doc, onSnapshot, addDoc, deleteDoc, updateDoc } from 'firebase/firestore'
	import { getAuth, onAuthStateChanged } from 'firebase/auth'
	import { db } from '@/firebase'
	import { getCurrentUser } from '../router';
	import moment from 'moment'
	import Modal from '../components/RecurrenceModal.vue'

	const emit = defineEmits([
		'close'
	])

	// Modals
	const showModal = ref(false)

	// Firebase refs
	const expensesCollectionRef = collection(db, 'expenses')

	const hiddenExpenses = ref(true)
	
	// Expenses
	const expenses = ref([])
	const filteredExpenses = ref([])
	const totalCost = ref([])
	
	// Get Expenses
	onMounted(async () => {
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
						interval: doc.data().interval,
						userid: doc.data().userid,
						createdAt: doc.data().createdAt,
						recurring: doc.data().recurring
					}
					fbExpenses.push(expense)
			})
			expenses.value = fbExpenses
			// Filter expenses to match logged in user
			const fExpenses = []
			expenses.value.forEach((item, index) => {
				if (item.userid === user.uid) {
					const expense = {
						id: item.id,
						company: item.company,
						type: item.type,
						amount: item.amount,
						isEdit: item.isEdit,
						interval: item.interval,
						userid: item.userid,
						createdAt: item.createdAt,
						recurring: item.recurring
					}
					fExpenses.push(expense)
				}
			})
			filteredExpenses.value = fExpenses
		})
	})

	// Get the total of all expenses
	onUpdated(() => {
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
	
	// Edit Expense
	const editExpense = async (expense) => {
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
		}
	}

	// Set Recurring
	const makeRecurring = (expense) => {
		console.log(expense.id);
		if (expense.id.value === expense.id.value) {
			if(expense.recurring) {
				updateDoc(doc(expensesCollectionRef, expense.id), {
					recurring: false
				})
			} else {
				updateDoc(doc(expensesCollectionRef, expense.id), {
					recurring: true
				})
				showModal.value = true
			}
		}
	}

	const interval = ref('')

	const setInterval = async (expense) => {
		showModal.value = !showModal.value

		await updateDoc(doc(expensesCollectionRef, expense.id), {
			interval: interval.value
		})
}
</script>


<style scoped>
h1 {
	text-align: center;
	font-size: 2rem;
	font-weight: 700;
}

a {
	color: #4a4a4a;
}

.add:hover {
	cursor: pointer;
}

.card-content {
	padding: 0;
}

.active {
	background-color: #32b85a;
	box-shadow: 0 0 0 0.125em #32b85a;
}
.active:hover {
	background-color: #32b85a;
	box-shadow: 0 0 0 0.125em #32b85a;
}

.month-btn {
	text-decoration: none;
	border: 0;
	background-color: white;
	cursor: pointer;
}

.modal-header .modal-default-button {
	cursor: pointer;
	border: none;
	outline: none;
	background: none;
	font-size: 1.25rem;
	font-weight: bold;
}

.modal-header .title{
  color: #42b983;
	margin: 0;
}

.modal-body {
  margin: 20px 0;
}
</style>