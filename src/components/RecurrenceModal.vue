<template>
	<Transition name="modal">
		<div v-if="show" class="modal-mask" id="modal">
			<div class="modal-wrapper" @click="setInterval()">
				<div class="modal-container" @click.stop="">
					<div class="modal-header title">
						<slot name="header" />
					</div>
					<div class="modal-body">
						<slot name="body" />
					</div>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, doc, updateDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase'

const props = defineProps({
  show: Boolean
})
const emit = defineEmits([
	'close'
])

const setInterval = (expense) => {
	emit('close')
}
</script>


<style scoped>
	.modal-mask {
		position: fixed;
		z-index: 9998;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: table;
		transition: opacity 0.3s ease;
	}

	.modal-wrapper {
 	 	display: table-cell;
  	vertical-align: middle;
}

.modal-container {
  width: 400px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}
.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
  margin-top: 0;
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

	.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>