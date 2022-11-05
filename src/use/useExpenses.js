import { ref, onMounted, onUpdated} from 'vue'


function useExpenses() {
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

  return {
    showModal,
    expensesCollectionRef,
    hiddenExpenses,
    expenses,
    filteredExpenses,
    totalCost,
    onSnapshot,
    addExpense,
    deleteExpense,
    editExpense,
    makeRecurring

  }

}