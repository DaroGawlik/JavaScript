import URL_API from '../config.js'

export default async function getGarage() {
	return await fetch(`${URL_API}/garage`).then((res) => res.json())
}

export async function getCar(id) {
	return await fetch(`${URL_API}/garage/${id}`).then((res) => res.json())
}

export async function createCarApiCall(newCarValue) {
	return await fetch(`${URL_API}/garage`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(newCarValue),
	}).then((res) => res.json())
}

export async function updateCarApiCall(getCarForSelect, id) {
	return await fetch(`${URL_API}/garage/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(getCarForSelect),
	}).then((res) => res.json())
}

export async function deleteCarApiCall(id) {
	return await fetch(`${URL_API}/garage/${id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
	}).then((res) => res.json())
}

export async function startRaceApiCall(id, status) {
	return await fetch(
		`${URL_API}/engine?${
			new URLSearchParams({
				id,
				status,
			})}`,
		{
			method: 'PATCH',
		},
	)
		.then((res) => res)
		.catch((error) => {
			console.error(error)
		})
}

export async function driveApiCall(id) {
	return fetch(
		`${URL_API}/engine?${
			new URLSearchParams({
				id,
				status: 'drive',
			})}`,
		{
			method: 'PATCH',
		},
	)
		.then((res) => res)

		.catch((error) => console.log(error))
}
