const responseSucces = (res, message, data, status = 200) => {
	res.status(status).send({
		succes: true,
		status,
		message,
		data,
		support: {
			url: 'https://reqres.in/#support-heading',
			text: 'To keep reqres free, contributors towards server costs are appreciated',
		},
	})
}

const responseError = (res, message = 'Server Error', status = 500) => {
	res.status(status).send({
		succes: false,
		status,
		message,
	})
}

export default {
	succes: responseSucces,
	error: responseError,
}
