import chalk from 'chalk'
import symbols from 'log-symbols'

import { api } from '../../config/envServer.js'

const render = (header, body) => {
	console.log(header)
	body && console.log(body)
	body && console.log('\n')
}

export default class Response {
	static listen() {
		const header = `${chalk.blue(`[Server of ${api.env}]`)} ${
			symbols.info
		} ${chalk.cyan(`${api.name} on ${api.server}`)}`
		render(header)
	}

	static success(req, res, status = 200, message) {
		const header = `${chalk.greenBright('[server]')} ${
			symbols.success
		} ${chalk.greenBright('Success operation')}`
		render(header, message)
	}

	static error(message) {
		const header = `${chalk.redBright('[server]')} ${
			symbols.error
		} ${chalk.redBright('Bad operation')}`
		render(header, message)
	}

	static info(message) {
		const header = `${chalk.yellowBright('[server]')} ${
			symbols.warning
		} ${chalk.yellowBright('Info operation')}`
		render(header, message)
	}
}
