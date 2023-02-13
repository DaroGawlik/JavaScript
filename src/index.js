import './css/style.css'
import garage from './garage/garage'
import winners from './winners/winners'

// NAV MAIN PAGE
const nav = document.createElement('nav')
document.body.appendChild(nav)
nav.classList.add('nav')

const garagePage = document.createElement('a')
nav.appendChild(garagePage)
garagePage.setAttribute('href', '/Garage')
garagePage.classList.add('nav-link')
garagePage.setAttribute('data-link', '')
garagePage.textContent = 'Garage'

const winnersPage = document.createElement('a')
nav.appendChild(winnersPage)
winnersPage.setAttribute('href', '/Winners')
winnersPage.classList.add('nav-link')
winnersPage.setAttribute('data-link', '')
winnersPage.textContent = 'Winners'

const main = document.createElement('div')
document.body.appendChild(main)
main.setAttribute('id', 'main')

// SPA MODULE
const navigateTo = (url) => {
	history.pushState(null, null, url)
	router()
}

const router = async () => {
	const routes = [
		{ path: '/Garage', view: garage },
		{ path: '/Winners', view: winners },
	]

	// Test each route for potential match
	const potentialMatches = routes.map((route) => ({
		route,
		isMatch: location.pathname === route.path,
	}))

	let match = potentialMatches.find((potentialMatches) => potentialMatches.isMatch)

	if (!match) {
		match = {
			route: routes[0],
			isMatch: true,
		}
	}

	const view = new match.route.view(document.querySelector('#main'))
}

window.addEventListener('popstate', router)

document.addEventListener('DOMContentLoaded', () => {
	document.body.addEventListener('click', (e) => {
		if (e.target.matches('[data-link]')) {
			e.preventDefault()
			navigateTo(e.target.href)
		}
	})

	router()
})

window.addEventListener('load', router())
