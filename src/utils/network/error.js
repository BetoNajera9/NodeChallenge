export default class ServerError extends Error {
	constructor(message, status = 500, name = 'ServerError', details) {
		super(message)
		this.name = name
		this.status = status
		this.details = details
	}

	response() {
		return {
			type: this.name,
			code: this.code,
			message: this.message,
		}
	}
}
