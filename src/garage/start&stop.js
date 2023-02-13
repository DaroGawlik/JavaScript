// import e from 'express'
import { startRaceApiCall, driveApiCall } from './apiFunctionsGarage.js'
import { catchCurrentCarPosition, isResetActiveAfterChangePage } from './pagination.js'
import {
	catchWinnerOfRace, addShadowRace, raceBtnActive, resetBtnActive,
} from './race&reset'
import { showStopCarReason } from './stopEngine'

let stopRaceBoolean = false
const currentCarPositionArray = []
let roadDistanceWidth

export function carBtnsMoveActive(boolean, clickRaceOrStop) {
	let btnStart
	let btnStop

	if (clickRaceOrStop.classList.contains('btn-start')) {
		btnStart = clickRaceOrStop
		btnStop = clickRaceOrStop.nextSibling
	} else {
		btnStart = clickRaceOrStop.previousSibling
		btnStop = clickRaceOrStop
	}
	btnStart.disabled = !boolean
	btnStart.classList[boolean ? 'remove' : 'add']('btn-off')

	btnStop.disabled = boolean
	btnStop.classList[boolean ? 'add' : 'remove']('btn-off')
}

export async function startRace(selectCarBtnRace) {
	addShadowRace()
	const btnStart = selectCarBtnRace

	postitionStart(btnStart)
	carBtnsMoveActive(false, btnStart)

	const targetCarId = btnStart.nextSibling.nextSibling.children[0].id
	const startStatus = 'started'

	startRaceApiCall(targetCarId, startStatus)
		.then(async (res) => {
			if (res.ok && startStatus == 'started') {
				return res.json()
			}
		})
		.then(async (res) => {
			driveApiCall(targetCarId)
				.then((res) => {
					if (!res.ok) {
						stopRaceBoolean = true
						carBtnsMoveActive(true, btnStart)

						return res.text()
					}
				})
				.then((data) => {
					if (data) {
						showStopCarReason(data, targetCarId)
						resetBtnActive(false)
					}
				})
			race(res, btnStart)
		})
}

export async function stopRace(selectCarBtnStop) {
	const btnStop = selectCarBtnStop
	carBtnsMoveActive(true, btnStop)

	const targetCarId = btnStop.nextSibling.children[0].id
	const stopStatus = 'stopped'

	startRaceApiCall(targetCarId, stopStatus).then(async (res) => {
		if (res.ok) {
			stopRaceBoolean = true
		}
	})
	raceBtnActive(true)
	resetBtnActive(false)
}

export async function race(dataRace, selectCarBtnRace) {
	const targetCar = selectCarBtnRace.nextSibling.nextSibling.children[0]
	const timeRace = dataRace.distance / dataRace.velocity
	const roadDistance = document.querySelector('.car-move-btns')
	roadDistanceWidth = roadDistance.offsetWidth - 150 - 120
	const velocityPx = roadDistanceWidth / timeRace
	const start = Date.now()
	const timer = setInterval(() => {
		const timePassed = Date.now() - start
		if (timePassed >= timeRace || stopRaceBoolean) {
			clearInterval(timer)
			carBtnsMoveActive(true, selectCarBtnRace)
			stopRaceBoolean = false
			saveCarPosition(targetCar, timePassed)
			isResetActiveAfterChangePage()
			return
		}
		draw(targetCar, timePassed, velocityPx)
	}, 5)
	stopRaceBoolean = false
}

function draw(targetCar, timePassed, velocityPx) {
	targetCar.style.left = `${timePassed * velocityPx}px`
}
export function postitionStart(selectCarBtnRace) {
	const targetCar = selectCarBtnRace.nextSibling.nextSibling.children[0]
	if (targetCar.style.left > `${0}px`) {
		targetCar.style.left = 0
	}
}

export function saveCarPosition(targetCar, timeOfRace) {
	removeOldPosition(targetCar)
	const currentCarPositionObject = { id: +targetCar.id, left: targetCar.style.left }
	catchWinnerOfRace(currentCarPositionObject, roadDistanceWidth, timeOfRace)
	currentCarPositionArray.push(currentCarPositionObject)
	catchCurrentCarPosition(currentCarPositionArray)
}

export function removeOldPosition(targetCar) {
	const indexObjectToRemove = currentCarPositionArray.findIndex((obj) => obj.id == targetCar.id)
	if (indexObjectToRemove >= 0) {
		currentCarPositionArray.splice(indexObjectToRemove, 1)
	}
}
