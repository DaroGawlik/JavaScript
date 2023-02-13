import AbstractView from '../AbstractView.js'
import { getWinners } from './apiFunctionsWinners.js'
import { sectionWinners } from './winnersTable.js'
import pagination from './winnersPagination.js'

let arrayWinners = []
export default class extends AbstractView {
	constructor(root) {
		super()
		this.setTitle('winners')
		this.root = root
		if (!root.children[0].classList.contains('winners-main') || root.children.length < 1) {
			this.renderMainWinners()
		}
	}

	renderMainWinners() {
		const winnersMain = document.createElement('div')
		this.root.appendChild(winnersMain)
		winnersMain.classList.add('winners-main')

		const garageMain = document.getElementsByClassName('garage-main')

		if (garageMain) {
			garageMain[0].remove()
		}

		renderHeaderPanel(winnersMain)
		sectionWinners(winnersMain)

		async function catchCarsOnStart() {
			arrayWinners = await getWinners()
			renderWinners(arrayWinners)
		}
		catchCarsOnStart()
	}
}

async function renderWinners(arrayWinners) {
	pagination(arrayWinners)
	howCarsInWinners(arrayWinners)
}

// HEADER PANEL

function renderHeaderPanel(winnersMain) {
	const headerPanel = document.createElement('div')
	headerPanel.classList.add('heder-panel')
	winnersMain.appendChild(headerPanel)
	headerPage(headerPanel)
	countsWinners(headerPanel)
}

function headerPage(headerPanel) {
	const pages = document.createElement('div')
	pages.classList.add('winners-pages')
	headerPanel.appendChild(pages)
}

export function whatPageIs(page) {
	const getClassOfPage = document.querySelector('.winners-pages')
	if (page == 0) {
		getClassOfPage.innerHTML = ''
	} else {
		getClassOfPage.innerHTML = `page #<span>${page}</span>`
	}
}

function countsWinners(headerPanel) {
	const numberOfWinners = document.createElement('div')
	numberOfWinners.classList.add('winners-number-winners')
	headerPanel.appendChild(numberOfWinners)
	howCarsInWinners()
}

async function howCarsInWinners() {
	const countCars = arrayWinners.length

	const getClassOfCount = document.querySelector('.winners-number-winners')
	if (countCars > 0) {
		getClassOfCount.innerHTML = `List of <span>${countCars}</span> Winners`
	} else {
		getClassOfCount.innerHTML = 'Noone yet has win Race'
	}
}
