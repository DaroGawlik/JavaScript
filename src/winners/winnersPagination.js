import { takeInfoFromRace } from './winnersTable.js'
import { whatPageIs } from './winners.js'
import { activeSort } from './tableSort'

let page = 1
const recordsPerPage = 10

export default function pagination(arrayWinners) {
	const mainTable = document.querySelector('.table-sortable')
	changePage(arrayWinners, mainTable)
}

const changePage = (arrayWinners, mainTable) => {
	if (mainTable.children[1].rows.length) {
		Array(...mainTable.children[1].rows).forEach((element) => element.remove())
	}
	if (page < 1) page = 1
	if (page > numPages(arrayWinners)) page = numPages(arrayWinners)
	for (let i = (page - 1) * recordsPerPage; i < page * recordsPerPage; i++) {
		if (i >= arrayWinners.length) {
			break
		}
		if (arrayWinners[i]) {
			takeInfoFromRace(arrayWinners[i])
		}
	}

	if (page < 1) page = 1
	if (page > numPages(arrayWinners)) page = numPages(arrayWinners)

	const catchPaginationBtns = document.querySelector('.pagination-btns')

	if (arrayWinners.length > 10 && !catchPaginationBtns) {
		renderPaginationBtns(arrayWinners)
	}

	const btnPrevious = document.querySelector('.btn-previous')
	const btnNext = document.querySelector('.btn-next')
	if (btnPrevious && btnNext) {
		if (page == 1) {
			btnPrevious.style.visibility = 'hidden'
		} else {
			btnPrevious.style.visibility = 'visible'
		}

		if (page == numPages(arrayWinners)) {
			btnNext.style.visibility = 'hidden'
		} else {
			btnNext.style.visibility = 'visible'
		}
	}
	whatPageIs(page)
	activeSort()
}

const numPages = (arrayWinners) => Math.ceil(arrayWinners.length / recordsPerPage)

const renderPaginationBtns = (arrayWinners) => {
	const winnersMain = document.querySelector('.winners-main')

	const paginationBtns = document.createElement('div')
	paginationBtns.classList.add('pagination-btns')
	winnersMain.appendChild(paginationBtns)

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
		prevPage(arrayWinners)
	})
	btnNext.addEventListener('click', () => {
		nextPage(arrayWinners)
	})
}

const prevPage = (arrayWinners) => {
	const mainTable = document.querySelector('.table-sortable')
	if (page > 1) {
		page--
		changePage(arrayWinners, mainTable)
	}
}
const nextPage = (arrayWinners) => {
	const mainTable = document.querySelector('.table-sortable')
	if (page < numPages(arrayWinners)) {
		page++
		changePage(arrayWinners, mainTable)
	}
}
