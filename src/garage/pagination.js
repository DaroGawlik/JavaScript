import { createCar, whatPageIs } from './garage.js'
import { raceBtnActive, resetBtnActive } from './race&reset'

let page = 1
const recordsPerPage = 7
let currentCarPostionArray

export default function pagination(arrayGarage) {
	const carsUl = document.querySelector('.cars-ul')
	changePage(arrayGarage, carsUl)
}

export function catchCurrentCarPosition(array) {
	if (array) {
		currentCarPostionArray = array
	}
}

function setCurrentCarPosition(targetCar) {
	if (targetCar.position) {
		const leftsize = currentCarPostionArray.find((element) => element.id == targetCar.id)
		if (leftsize) {
			targetCar.position = leftsize.left
		} else {
			delete targetCar.position
		}
	} else if (currentCarPostionArray) {
		const leftsize = currentCarPostionArray.find((element) => element.id == targetCar.id)
		if (leftsize) {
			targetCar.position = leftsize.left
		}
	}
}

const changePage = (arrayGarage, carsUl) => {
	if (carsUl.children.length) {
		Array(...carsUl.children).forEach((element) => element.remove())
	}
	if (page < 1) page = 1
	if (page > numPages(arrayGarage)) page = numPages(arrayGarage)
	for (let i = (page - 1) * recordsPerPage; i < page * recordsPerPage; i++) {
		if (i >= arrayGarage.length) {
			break
		}
		if (arrayGarage[i]) {
			setCurrentCarPosition(arrayGarage[i])
			createCar(arrayGarage[i])
		}
	}
	if (page < 1) page = 1
	if (page > numPages(arrayGarage)) page = numPages(arrayGarage)

	const catchPaginationBtns = document.querySelector('.pagination-btns')

	if (arrayGarage.length > 7 && !catchPaginationBtns) {
		renderPaginationBtns(carsUl, arrayGarage)
	}

	const btnPrevious = document.querySelector('.btn-previous')
	const btnNext = document.querySelector('.btn-next')
	if (btnPrevious && btnNext) {
		if (page == 1) {
			btnPrevious.style.visibility = 'hidden'
		} else {
			btnPrevious.style.visibility = 'visible'
		}

		if (page == numPages(arrayGarage)) {
			btnNext.style.visibility = 'hidden'
		} else {
			btnNext.style.visibility = 'visible'
		}
	}
	whatPageIs(page)
}

const numPages = (arrayGarage) => Math.ceil(arrayGarage.length / recordsPerPage)

const renderPaginationBtns = (carsUl, arrayGarage) => {
	const paginationBtns = document.createElement('div')
	paginationBtns.classList.add('pagination-btns')
	carsUl.appendChild(paginationBtns)

	const btnPrevious = document.createElement('button')
	btnPrevious.classList.add('btn-previous')
	btnPrevious.classList.add('nav-link')
	btnPrevious.textContent = 'previous'
	paginationBtns.appendChild(btnPrevious)

	const btnNext = document.createElement('button')
	btnNext.classList.add('btn-next')
	btnNext.classList.add('nav-link')
	btnNext.textContent = 'next'
	paginationBtns.appendChild(btnNext)

	btnPrevious.addEventListener('click', () => {
		prevPage(arrayGarage)
	})
	btnNext.addEventListener('click', () => {
		nextPage(arrayGarage)
	})
}

const prevPage = (arrayGarage) => {
	const carsUl = document.querySelector('.cars-ul')
	if (page > 1) {
		page--
		changePage(arrayGarage, carsUl)
	}
	isResetActiveAfterChangePage()
}
const nextPage = (arrayGarage) => {
	const carsUl = document.querySelector('.cars-ul')
	if (page < numPages(arrayGarage)) {
		page++
		changePage(arrayGarage, carsUl)
	}
	isResetActiveAfterChangePage()
}

export function isResetActiveAfterChangePage() {
	const allCarsOnPage = document.querySelectorAll('.car-img')
	for (let i = 0; i < allCarsOnPage.length; i++) {
		const carPosition = Number(allCarsOnPage[i].children[0].style.left.slice(0, -2))
		if (carPosition > 0) {
			resetBtnActive(false)
			raceBtnActive(true)
			break
		} else {
			resetBtnActive(true)
			raceBtnActive(false)
		}
	}
}
