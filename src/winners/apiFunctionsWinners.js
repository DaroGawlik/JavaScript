import URL_API from '../config.js'

export async function getWinners() {
	return await fetch(`${URL_API}/winners`).then(res => res.json())
}

export async function createWinnerApiCall(winnerCar) {
	return await fetch(`${URL_API}/winners`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(winnerCar),
	}).then(res => res.json())
}

export async function updateWinnerApiCall(id, updateWinner) {
	return await fetch(`${URL_API}/winners/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(updateWinner),
	}).then(res => res.json())
}

export async function deleteWinnerApiCall(id) {
	return await fetch(`${URL_API}/winners/${id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
	}).then(res => res.json())
}
