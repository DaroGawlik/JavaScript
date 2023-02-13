import AbstractView from '../AbstractView.js'
import carSvg from '../assets/car.svg'
import flagSvg from '../assets/flag.svg'
import getGarage, { createCarApiCall } from './apiFunctionsGarage.js'

import pagination, { isResetActiveAfterChangePage } from './pagination.js'

import { selectCar, deleteCar } from './select&delete.js'
import { startRace, stopRace } from './start&stop.js'
import { stopEngineBeforeMeta } from './stopEngine'
import {
	raceCurrentPage, resetRaceCurrentPage, resetBtnActive, resetLetCountWinner,
} from './race&reset.js'

let arrayGarage = []

export default class extends AbstractView {
	constructor(root) {
		super()
		this.setTitle('garage')
		this.root = root
		if (!root.children.length || !root.children[0].classList.contains('garage-main')) {
			this.renderMainGarage()
		}
	}

	renderMainGarage() {
		const garageMain = document.createElement('div')
		garageMain.classList.add('garage-main')
		this.root.appendChild(garageMain)

		const winnersMain = document.getElementsByClassName('winners-main')

		if (winnersMain.length) {
			winnersMain[0].remove()
		}

		renderSetPanel(garageMain)
		renderSectionPanel(garageMain)
		async function catchCarsOnStart() {
			arrayGarage = await getGarage()
			renderGarage(arrayGarage)
			removeSpanBeforeResponseDefaultCarFromApi()
		}
		catchCarsOnStart()
	}
}

export async function renderGarage(arrayGarage) {
	pagination(arrayGarage)
	btnGenerateCheck()
	howCarsInGarage(arrayGarage)
}

// SETTINGS PANEL

const renderSetPanel = (garageMain) => {
	const setPanel = document.createElement('div')
	setPanel.classList.add('set-panel')
	garageMain.appendChild(setPanel)
	setCreate(setPanel)
	setUpdate(setPanel)
	setBtns(setPanel)
}

// SETTINGS PANEL - create

const setCreate = (setPanel) => {
	const formCreate = document.createElement('form')
	formCreate.classList.add('form-create')
	setPanel.appendChild(formCreate)

	const nameInput = document.createElement('input')
	nameInput.classList.add('name-input')
	nameInput.setAttribute('type', 'name')
	nameInput.placeholder = 'Put name here..'
	formCreate.appendChild(nameInput)

	const colorInput = document.createElement('input')
	colorInput.classList.add('color-input')
	colorInput.setAttribute('type', 'color')
	formCreate.appendChild(colorInput)

	const btnCreate = document.createElement('button')
	btnCreate.classList.add('button')
	btnCreate.classList.add('btn-create')
	btnCreate.setAttribute('type', 'submit')
	btnCreate.textContent = 'create'
	formCreate.appendChild(btnCreate)

	submitNewCar(btnCreate, nameInput)
}

const submitNewCar = (btnCreate, nameInput) => {
	arrayGarage = arrayGarage
	btnCreate.addEventListener('click', () => {
		if (nameInput.value === '') {
			alert('Put car name')
		} else {
			const newCarValue = Array.from(document.querySelectorAll('.name-input,.color-input')).reduce(
				(acc, input) => ({ ...acc, [input.type]: input.value }),
				{},
			)

			event.preventDefault()
			delete Object.assign(newCarValue, { name: newCarValue.text }).text

			async function executeCreateCar() {
				const newCarObject = await createCarApiCall(newCarValue)
				arrayGarage.push(newCarObject)
				createCar(newCarObject)
				pagination(arrayGarage)
			}
			executeCreateCar()

			const clearCreateInputs = Array.from(document.querySelectorAll('.name-input,.color-input'))
			clearCreateInputs.forEach((input) => (input.value = ''))
		}
		event.preventDefault()
	})
}

// SETTINGS PANEL - update

const setUpdate = (setPanel) => {
	const formUpdate = document.createElement('form')
	formUpdate.classList.add('form-update')
	setPanel.appendChild(formUpdate)

	const nameUpdate = document.createElement('input')
	nameUpdate.classList.add('name-update')
	nameUpdate.setAttribute('type', 'name')
	nameUpdate.placeholder = 'Put new name here..'
	formUpdate.appendChild(nameUpdate)

	const colorUpdate = document.createElement('input')
	colorUpdate.classList.add('color-update')
	colorUpdate.setAttribute('type', 'color')
	formUpdate.appendChild(colorUpdate)

	const btnUpdate = document.createElement('button')
	btnUpdate.classList.add('button')
	btnUpdate.classList.add('btn-update')
	btnUpdate.setAttribute('type', 'submit')
	btnUpdate.textContent = 'update'
	formUpdate.appendChild(btnUpdate)

	changeDisabled(true)
}

export function changeDisabled(boolean) {
	const newCarValue = Array.from(document.querySelectorAll('.name-update,.color-update,.btn-update'))
	for (let i = 0; i < newCarValue.length; i++) {
		newCarValue[i].disabled = boolean
		newCarValue[i].classList.add('btn-off')
	}
	if (!boolean) {
		for (let i = 0; i < newCarValue.length; i++) {
			newCarValue[i].disabled = boolean
			newCarValue[i].classList.remove('btn-off')
		}
	}
}

// SETTINGS PANEL - buttons

const setBtns = (setPanel) => {
	const formSetBtn = document.createElement('div')
	formSetBtn.classList.add('form-set-btns')
	setPanel.appendChild(formSetBtn)

	const btnRace = document.createElement('button')
	btnRace.classList.add('button')
	btnRace.classList.add('btn-race')
	btnRace.textContent = 'race'
	formSetBtn.appendChild(btnRace)

	const btnReset = document.createElement('button')
	btnReset.classList.add('button')
	btnReset.classList.add('btn-reset')
	btnReset.textContent = 'reset'
	formSetBtn.appendChild(btnReset)

	const btnGenerate = document.createElement('button')
	btnGenerate.classList.add('button')
	btnGenerate.classList.add('btn-generate')
	btnGenerate.setAttribute('type', 'submit')
	btnGenerate.textContent = 'generate cars'
	formSetBtn.appendChild(btnGenerate)

	submitGenerateCars(btnGenerate)

	btnRace.addEventListener('click', raceCurrentPage)
	btnReset.addEventListener('click', resetRaceCurrentPage)
	resetBtnActive(true)
}

// SETTINGS PANEL - buttons random generate

const submitGenerateCars = (btnGenerate) => {
	btnGenerate.addEventListener('click', () => {
		for (let i = 0; i < 100; i++) {
			generateRandomCars()
		}

		btnGenerateCheck()
	})
}

const btnGenerateCheck = () => {
	const btnGenerate = document.querySelector('.btn-generate')
	if (arrayGarage.length > 50) {
		btnGenerate.classList.add('btn-off')
		btnGenerate.disabled = true
	}
}

// SECTION PANEL

const renderSectionPanel = (garageMain) => {
	const sectionPanel = document.createElement('div')
	sectionPanel.classList.add('section-panel')
	garageMain.appendChild(sectionPanel)
	sectionHeader(sectionPanel)
	sectionCars(sectionPanel)
}

// SECTION PANEL - header

const sectionHeader = (renderSectionPanel) => {
	const headerGarage = document.createElement('div')
	headerGarage.classList.add('header-garage')
	renderSectionPanel.appendChild(headerGarage)

	const headerPage = document.createElement('div')
	headerPage.classList.add('header-page')
	renderSectionPanel.appendChild(headerPage)
}

export async function howCarsInGarage(arrayGarage) {
	const countCars = arrayGarage.length

	const getClassOfCount = document.querySelector('.header-garage')
	if (countCars > 0) {
		getClassOfCount.innerHTML = `You have <span>${countCars}</span> cars in garage`
	} else {
		getClassOfCount.innerHTML = 'You dont have Cars in garage'
	}
}

export function whatPageIs(page) {
	const getClassOfPage = document.querySelector('.header-page')
	if (page == 0) {
		getClassOfPage.innerHTML = ''
	} else {
		getClassOfPage.innerHTML = `page #<span>${page}</span>`
	}
}

// SECTION PANEL - cars

const sectionCars = (renderSectionPanel) => {
	const carsUl = document.createElement('ul')
	carsUl.classList.add('cars-ul')
	renderSectionPanel.appendChild(carsUl)
	addSpanBeforeResponseDefaultCarFromApi(carsUl)
}

function addSpanBeforeResponseDefaultCarFromApi(carsUl) {
	const infoBeforeApiResponse = document.createElement('span')
	infoBeforeApiResponse.classList.add('info-before-api-response')
	infoBeforeApiResponse.textContent = 'waiting for your cars in garage'
	carsUl.appendChild(infoBeforeApiResponse)
}

function removeSpanBeforeResponseDefaultCarFromApi() {
	const infoBeforeApiResponse = document.getElementsByClassName('info-before-api-response')
	if (infoBeforeApiResponse.length > 0) {
		infoBeforeApiResponse.parentNode.removeChild(infoBeforeApiResponse)
	}
}

// SECTION PANEL - cars create

export function createCar(targetCar) {
	const carsUl = document.querySelector('.cars-ul')
	const carLi = document.createElement('div')
	carLi.classList.add('car-li')
	carLi.classList.add(`row-id-${targetCar.id}`)
	carLi.classList.add(`${targetCar.id}`)
	carsUl.appendChild(carLi)

	createCarBtns(carLi, targetCar)
	createCarRoad(carLi, targetCar)
}

const createCarBtns = (carLi, targetCar) => {
	const carBtnsSet = document.createElement('div')
	carBtnsSet.classList.add('car-set-btns')
	carLi.appendChild(carBtnsSet)

	const btnSelect = document.createElement('button')
	btnSelect.classList.add('button')
	btnSelect.classList.add('btn-select')
	btnSelect.textContent = 'select'
	carBtnsSet.appendChild(btnSelect)

	const btnDelete = document.createElement('button')
	btnDelete.classList.add('button')
	btnDelete.classList.add('btn-delete')
	btnDelete.textContent = 'delete'
	carBtnsSet.appendChild(btnDelete)

	const carName = document.createElement('span')
	carName.classList.add('car-name')
	carName.textContent = `${targetCar.name}`
	carBtnsSet.appendChild(carName)

	btnSelect.addEventListener('click', selectCar)
	btnDelete.addEventListener('click', (e) => {
		deleteCar(e).then((data) => {
			arrayGarage = data
			renderGarage(arrayGarage)
			isResetActiveAfterChangePage()
		})
	})
}

const createCarRoad = (carLi, targetCar) => {
	const carMain = document.createElement('div')
	carMain.classList.add('road-main')
	carLi.appendChild(carMain)

	const carBtnsMove = document.createElement('div')
	carBtnsMove.classList.add('car-move-btns')
	carMain.appendChild(carBtnsMove)

	const btnStart = document.createElement('button')
	btnStart.classList.add('button')
	btnStart.classList.add('btn-start')
	btnStart.disabled = false
	btnStart.textContent = 'start'
	carBtnsMove.appendChild(btnStart)

	const btnStop = document.createElement('button')
	btnStop.classList.add('button')
	btnStop.classList.add('btn-stop')
	btnStop.classList.add('btn-off')
	btnStop.disabled = true
	btnStop.textContent = 'stop'
	carBtnsMove.appendChild(btnStop)

	const imgCar = document.createElement('div')
	imgCar.classList.add('car-img')
	imgCar.classList.add(`div-car-${targetCar.id}`)
	imgCar.classList.add(`${targetCar.id}`)
	imgCar.insertAdjacentHTML('beforeend', carSvg)

	carBtnsMove.appendChild(imgCar)

	const carSettings = imgCar.children[0]
	carSettings.style.fill = `${targetCar.color}`
	carSettings.setAttribute('id', `${targetCar.id}`)

	carSettings.style.left = `${targetCar.position}`

	const imgFlag = document.createElement('div')
	imgFlag.classList.add('flag-img')
	imgFlag.insertAdjacentHTML('beforeend', flagSvg)
	carBtnsMove.appendChild(imgFlag)

	btnStart.addEventListener('click', async (car) => {
		resetLetCountWinner()
		startRace(car.target)
	})

	btnStop.addEventListener('click', (car) => {
		stopRace(car.target)
		stopEngineBeforeMeta()
	})
	howCarsInGarage(arrayGarage)
}

const generateRandomCars = () => {
	const carNameArr = [
		'Porsche',
		'Bentley',
		'Aston Martin',
		'Bugatti',
		'Lamborghini',
		'McLaren',
		'Rolls-Royce',
		'Maserati',
		'Ferrari',
		'Cadillac',
	]
	const carModelArr = [
		'Huracan',
		'Quattroporte',
		'Bentayga',
		'Vantage',
		'Phantom',
		'Chiron',
		'Ghost',
		'Veyron',
		'Tributo',
		'Aventador',
	]
	const randomBrandName = carNameArr[Math.floor(Math.random() * carNameArr.length)]
	const randomModelName = carModelArr[Math.floor(Math.random() * carModelArr.length)]

	const randomColor = Math.floor(Math.random() * 16777215).toString(16)
	const randomCar = {
		name: `${randomBrandName} ${randomModelName}`,
		color: `#${randomColor}`,
	}
	async function executeCreateCar() {
		const randomCarNewValue = await createCarApiCall(randomCar)
		arrayGarage.push(randomCarNewValue)
		createCar(randomCarNewValue)
		pagination(arrayGarage)
	}
	executeCreateCar()
}
