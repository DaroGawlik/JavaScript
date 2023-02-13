import getGarage from '../garage/apiFunctionsGarage.js'
import carSvg from '../assets/car.svg'

let arrayGarage = []
let nrRow = 0
const nrRowArray = []

export function sectionWinners(winnersMain) {
	const sectionWinners = document.createElement('div')
	sectionWinners.classList.add('sectionWinners')
	winnersMain.appendChild(sectionWinners)
	addSpanBeforeResponseWinnersCarFromApi(sectionWinners)
	createTable(sectionWinners)
}

function addSpanBeforeResponseWinnersCarFromApi(sectionWinners) {
	const infoBeforeApiResponse = document.createElement('span')
	infoBeforeApiResponse.classList.add('info-before-api-response')
	infoBeforeApiResponse.textContent = 'waiting for list of winners'
	sectionWinners.appendChild(infoBeforeApiResponse)
}

function removeSpanBeforeResponseWinnersCarFromApi() {
	const infoBeforeApiResponse = document.getElementsByClassName('info-before-api-response')
	if (infoBeforeApiResponse.length > 0) {
		infoBeforeApiResponse[0].parentNode.removeChild(infoBeforeApiResponse[0])
	}
}

function createTable(sectionWinners) {
	const mainTable = document.createElement('table')
	mainTable.classList.add('table-sortable')
	sectionWinners.appendChild(mainTable)

	createthead(mainTable)

	const tbody = document.createElement('tbody')
	tbody.classList.add('tbody')
	mainTable.appendChild(tbody)
}

function createthead(mainTable) {
	const tableThead = document.createElement('thead')
	tableThead.classList.add('tableThead')
	mainTable.appendChild(tableThead)

	const tableTr = document.createElement('tr')
	tableThead.appendChild(tableTr)

	const tableThNr = document.createElement('th')
	tableThNr.textContent = 'No.'
	tableTr.appendChild(tableThNr)
	const tableThNameCar = document.createElement('th')
	tableThNameCar.textContent = 'Name'
	tableThNameCar.classList.add('toSort')
	tableTr.appendChild(tableThNameCar)
	const tableThImageCar = document.createElement('th')
	tableTr.appendChild(tableThImageCar)
	tableThImageCar.textContent = 'Car'
	const tableThWins = document.createElement('th')
	tableThWins.textContent = 'Wins'
	tableThWins.classList.add('toSort')
	tableTr.appendChild(tableThWins)
	const tableThTime = document.createElement('th')
	tableThTime.textContent = 'Best time'
	tableThTime.classList.add('toSort')
	tableTr.appendChild(tableThTime)
}

function createtbody(winnerCar) {
	const tbody = document.querySelector('.tbody')

	const tableTr = document.createElement('tr')
	tbody.appendChild(tableTr)

	const tableTdNr = document.createElement('td')
	tableTdNr.textContent = `${winnerCar.nrRow}`
	tableTr.appendChild(tableTdNr)

	const tableTdNameCar = document.createElement('td')
	tableTdNameCar.textContent = `${winnerCar.name}`
	tableTr.appendChild(tableTdNameCar)

	const tableTdImageCar = document.createElement('td')
	tableTdImageCar.insertAdjacentHTML('beforeend', carSvg)
	tableTr.appendChild(tableTdImageCar)

	const carSettings = tableTdImageCar.children[0]
	carSettings.style.fill = `${winnerCar.color}`

	const tableTdWins = document.createElement('td')
	tableTdWins.textContent = `${winnerCar.wins}`
	tableTr.appendChild(tableTdWins)

	const tableTdTime = document.createElement('td')
	tableTdTime.textContent = `${winnerCar.time}`
	tableTr.appendChild(tableTdTime)

	removeSpanBeforeResponseWinnersCarFromApi()
}

export async function takeInfoFromRace(winner) {
	arrayGarage = await getGarage(getGarage)

	const winnerCarInGarage = arrayGarage.findIndex((obj) => obj.id == winner.id)
	const winnerCarFromGarage = arrayGarage[winnerCarInGarage]

	const nrRowCurrently = await checkNrRow(winner)

	const carValueWinnersPage = {
		nrRow: Number(nrRowCurrently.nrRow),
		name: winnerCarFromGarage.name,
		color: winnerCarFromGarage.color,
		wins: Number(winner.wins),
		time: Number(winner.time),
	}

	createtbody(carValueWinnersPage)
}

export function checkNrRow(winner) {
	const { id } = winner
	const rowInWinnerTable = nrRowArray.findIndex((obj) => obj.id == winner.id)

	if (rowInWinnerTable < 0) {
		nrRow += 1
		const nrRowById = {
			id,
			nrRow,
		}
		nrRowArray.push(nrRowById)
		return nrRowById
	}
	const nrRowCurrently = nrRowArray[rowInWinnerTable]
	return nrRowCurrently
}

export function deleteNrRowArray() {
	nrRowArray.length = 0
	nrRow = 0
}
