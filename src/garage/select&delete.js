import getGarage, { updateCarApiCall, deleteCarApiCall } from './apiFunctionsGarage.js'

import { renderGarage, changeDisabled } from './garage.js'
import { isResetActiveAfterChangePage } from './pagination.js'
import { deleteNrRowArray } from '../winners/winnersTable.js'
import { deleteWinnerApiCall, getWinners } from '../winners/apiFunctionsWinners'

let arrayGarage
let idInSelect

export function selectCar(selectCar) {
	const targetCarId = Number(selectCar.target.parentElement.nextSibling.children[0].children[2].children[0].id)
	async function getCarsApiCallForSelect(targetCarId) {
		arrayGarage = await getGarage()
		const getCarForSelect = arrayGarage.find((x) => x.id == targetCarId)
		changeDisabled(false)
		putOldValueToSelect(getCarForSelect)

		const btnUpdate = document.querySelector('.btn-update')
		btnUpdate.addEventListener('click', () => {
			sendNewCarValue(getCarForSelect)
			event.preventDefault()
		})
	}
	getCarsApiCallForSelect(targetCarId)
}

async function putOldValueToSelect(getCarForSelect) {
	const selectCarValueName = await document.querySelector('.name-update')
	selectCarValueName.value = `${getCarForSelect.name}`

	const selectCarValueColor = await document.querySelector('.color-update')
	selectCarValueColor.value = `${getCarForSelect.color}`
	idInSelect = getCarForSelect.id
}

async function sendNewCarValue(getCarForSelect) {
	const nameInput = document.querySelector('.name-update')
	const colorInput = document.querySelector('.color-update')
	const targetId = getCarForSelect.id
	if (nameInput.value === '') {
		alert('Put car name')
	} else {
		getCarForSelect.name = nameInput.value
		getCarForSelect.color = colorInput.value
	}
	await updateCarApiCall(getCarForSelect, targetId)
	renderGarage(arrayGarage)
	changeDisabled(true)
	clearSelectInputs()
	idInSelect = 0
}

export async function deleteCar(carToDelete) {
	const targetCarId = Number(carToDelete.target.parentElement.nextSibling.children[0].children[2].children[0].id)
	if (idInSelect == targetCarId) {
		clearSelectInputs()
		changeDisabled(true)
		idInSelect = 0
	}
	deleteNrRowArray()
	return await deleteCarApiCall(targetCarId)
		.then(doesCarToDeleteIsInWinners(targetCarId))
		.then(async (deleteResData) => getGarage())
}

const clearSelectInputs = () => Array.from(document.querySelectorAll('.name-update,.color-update')).forEach((input) => (input.value = ''))

async function doesCarToDeleteIsInWinners(targetCarId) {
	const winnersArray = await getWinners()
	const rowInWinnerTable = winnersArray.findIndex((obj) => obj.id == targetCarId)
	if (rowInWinnerTable > -1) {
		deleteWinnerApiCall(targetCarId)
	}
}
