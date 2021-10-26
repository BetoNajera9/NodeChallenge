export default class ServerError extends Error {
	constructor(
		message,
		status = 500,
		name = 'ServerError',
		expose = 'ServerError'
	) {
		super(message)
		this.name = name
		this.status = status
		this.expose = expose
	}
}
