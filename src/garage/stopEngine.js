export function showStopCarReason(data, targetCarId) {
	const rowOfStopEngine = document.querySelector(`.row-id-${targetCarId}`)
	const spanOfStopEngine = document.createElement('span')
	spanOfStopEngine.classList.add('engine-info')
	spanOfStopEngine.textContent = `${data}`
	rowOfStopEngine.appendChild(spanOfStopEngine)
}

export function removeStopCarReason() {
	const spanOfStopEngine = document.querySelectorAll('.engine-info')
	for (let i = 0; i < spanOfStopEngine.length; i++) {
		spanOfStopEngine[i].remove()
	}
}

export function stopEngineBeforeMeta() {
	const spanOfStopEngine = document.querySelectorAll('.engine-info')
	const isShadowOnPage = document.querySelector('.popup-shadow')
	if (spanOfStopEngine) {
		for (const error of spanOfStopEngine) {
			error.parentNode.removeChild(error)
		}
	}
	if (isShadowOnPage) {
		isShadowOnPage.remove()
	}
}
