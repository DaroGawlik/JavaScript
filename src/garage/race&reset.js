import {
	startRace, stopRace, postitionStart, removeOldPosition,
} from './start&stop.js'
import { getCar } from './apiFunctionsGarage.js'
import { removeStopCarReason, stopEngineBeforeMeta } from './stopEngine'
import carSvg from '../assets/car.svg'
import { createWinnerApiCall, getWinners, updateWinnerApiCall } from '../winners/apiFunctionsWinners.js'
import { isResetActiveAfterChangePage } from './pagination.js'

let countWinner = 0
let carsInRace = []

export async function raceCurrentPage() {
	raceBtnActive(true)
	resetBtnActive(false)
	countWinner = 0
	startAllCars()
}

export function raceBtnActive(boolean) {
	const btnRace = document.querySelector('.btn-race')
	btnRace.disabled = boolean
	btnRace.classList[boolean ? 'add' : 'remove']('btn-off')
}

export function resetLetCountWinner() {
	countWinner = 0
}

export function resetRaceCurrentPage() {
	const carsOnPage = Array.from(document.querySelectorAll('.btn-stop'))
	for (let i = 0; i < carsOnPage.length; i++) {
		const selectCarBtnStop = carsOnPage[i]
		const carId = selectCarBtnStop.nextSibling.children[0]
		stopRace(selectCarBtnStop)
		const btnStart = selectCarBtnStop.previousSibling
		postitionStart(btnStart)
		removeOldPosition(carId)
	}
	carsInRace = []
	resetBtnActive(true)
	raceBtnActive(false)
	removeStopCarReason()
	countWinner = 0
}

export function resetBtnActive(boolean) {
	const btnRace = document.querySelector('.btn-reset')
	btnRace.disabled = boolean
	btnRace.classList[boolean ? 'add' : 'remove']('btn-off')
}

async function startAllCars() {
	const carsOnPage = Array.from(document.querySelectorAll('.btn-start'))
	for (let i = 0; i < carsOnPage.length; i++) {
		const selectCarBtnRace = carsOnPage[i]
		startRace(selectCarBtnRace)

		carsInRace.push(i)
	}
}

export async function catchWinnerOfRace(carAfterRace, roadDistanceWidth, timeOfRace) {
	const winnerId = carAfterRace.id
	const winnerTime = (timeOfRace / 1000).toFixed(2)
	const carDistance = Number(carAfterRace.left.slice(0, -2))
	if (countWinner < 1 && roadDistanceWidth - 5 < carDistance) {
		countWinner = 1
		await getCar(winnerId).then((data) => {
			const winnerInfo = data
			winnerInfo.time = winnerTime
			infoWinnerPopUpView(winnerInfo)
			createWinner(winnerId, winnerTime)
		})
	}
	carsInRace.pop()
	if (carsInRace.length === 0 && countWinner == 1) {
		btnExitPopUpActive(false)
	}
	if (carsInRace.length === 0 && countWinner == 0) {
		setTimeout(() => {
			stopEngineBeforeMeta()
		}, 4000)
	}
}

export function addShadowRace() {
	const isShadowOnPage = document.querySelector('.popup-shadow')
	if (!isShadowOnPage) {
		const infoWinnerPopUpViewShadow = document.createElement('div')
		infoWinnerPopUpViewShadow.classList.add('popup-shadow')
		document.body.appendChild(infoWinnerPopUpViewShadow)
	}
}

export function removeShadow() {
	document.querySelector('.popup-shadow').remove()
}

function infoWinnerPopUpView(winnerInfo) {
	const infoWinnerPopUpViewShadow = document.querySelector('.popup-shadow')

	const infoWinnerPopUpViewFiled = document.createElement('div')
	infoWinnerPopUpViewFiled.classList.add('popup-filed')
	infoWinnerPopUpViewFiled.classList.add('nav-link')
	infoWinnerPopUpViewShadow.appendChild(infoWinnerPopUpViewFiled)

	const infoWinnerPopUpViewHeader = document.createElement('p')
	infoWinnerPopUpViewHeader.classList.add('popup-header')
	infoWinnerPopUpViewFiled.appendChild(infoWinnerPopUpViewHeader)
	infoWinnerPopUpViewHeader.textContent = 'The winner is:'

	const btnExitPopUp = document.createElement('button')
	btnExitPopUp.classList.add('button')
	btnExitPopUp.classList.add('btn-exit-popup')
	btnExitPopUp.textContent = 'ok'
	infoWinnerPopUpViewFiled.appendChild(btnExitPopUp)
	btnExitPopUpActive(true)
	btnExitPopUp.addEventListener('click', () => {
		btnExitPopUpActive(true)
		removeShadow()
		resetBtnActive(false)
		removeStopCarReason()
		isResetActiveAfterChangePage()
	})
	infoWinnerPopUpViewCar(infoWinnerPopUpViewFiled, winnerInfo)
}

async function btnExitPopUpActive(boolean) {
	const btnExitPopUp = document.querySelector('.btn-exit-popup')
	btnExitPopUp.disabled = boolean
	btnExitPopUp.classList[boolean ? 'add' : 'remove']('btn-off')
}

function infoWinnerPopUpViewCar(infoWinnerPopUpViewFiled, winnerInfo) {
	const winnerFiled = document.createElement('div')
	winnerFiled.classList.add('popup-winner-info')
	infoWinnerPopUpViewFiled.appendChild(winnerFiled)

	const winnerName = document.createElement('div')
	winnerName.classList.add('popup-winner-name')
	winnerName.textContent = `${winnerInfo.name}`
	winnerFiled.appendChild(winnerName)

	const winnerTime = document.createElement('div')
	winnerTime.classList.add('popup-winner-time')
	winnerTime.textContent = `${winnerInfo.time} sek`
	winnerFiled.appendChild(winnerTime)

	const winnerCar = document.createElement('div')
	winnerCar.classList.add('popup-winner-car')
	winnerCar.insertAdjacentHTML('beforeend', carSvg)
	const carSettings = winnerCar.children[0]
	carSettings.style.fill = `${winnerInfo.color}`
	winnerFiled.appendChild(winnerCar)
}

async function createWinner(winnerId, winnerTime) {
	const dataFromApiWinners = await getWinners()
	await submitNewWinner(dataFromApiWinners, winnerId, winnerTime)
	await findNumbersOfWin(winnerId, dataFromApiWinners, winnerTime)
}

async function findNumbersOfWin(winnerId, arrayFromApiWinners, winnerTime) {
	const catchWinnerInRanking = arrayFromApiWinners.findIndex((obj) => obj.id == winnerId)
	const currentWinner = arrayFromApiWinners[catchWinnerInRanking]
	if (currentWinner) {
		const oldTime = Number(arrayFromApiWinners[catchWinnerInRanking].time)
		const currentTime = Number(winnerTime)
		if (oldTime > currentTime) {
			currentWinner.time = currentTime
			currentWinner.wins += 1
			updateWinnerApiCall(winnerId, currentWinner)
		} else {
			currentWinner.wins += 1
			updateWinnerApiCall(winnerId, currentWinner)
		}
	}
}

async function submitNewWinner(arrayFromApiWinners, winnerId, winnersTime) {
	const catchWinnerInRanking = arrayFromApiWinners.findIndex((obj) => obj.id == winnerId)
	const currentWinner = arrayFromApiWinners[catchWinnerInRanking]
	if (!currentWinner) {
		const winnerInfo = {
			id: winnerId,
			wins: 1,
			time: winnersTime,
		}
		createWinnerApiCall(winnerInfo)
	}
}
