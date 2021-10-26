import chalk from 'chalk'

import { api } from '../../config/envServer.js'

const render = (header, body) => {
	console.log(header)
	body && console.log(body)
	body && console.log('\n')
}

export default class Response {
	static listen() {
		const header = `${chalk.blue(`[Server of ${api.env}]`)}  ${chalk.cyan(
			`${api.name} on ${api.server}`
		)}`
		render(header)
	}

	static success(req, res, status = 200, message) {
		const header = `${chalk.greenBright('[server]')}  ${chalk.greenBright(
			'Success operation'
		)}`
		render(header, message)
	}

	static error(message) {
		const header = `${chalk.redBright('[server]')}  ${chalk.redBright(
			'Bad operation'
		)}`
		render(header, message)
	}

	static info(message) {
		const header = `${chalk.yellowBright('[server]')}  ${chalk.yellowBright(
			'Info operation'
		)}`
		render(header, message)
	}
}
