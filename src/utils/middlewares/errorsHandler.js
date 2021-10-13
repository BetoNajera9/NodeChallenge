// Dependencies error handler
import * as Sentry from '@sentry/node'
import '@sentry/tracing'

// Other dependencies
import { api, sentry } from '../../config/envServer.js'
import response from '../network/response.js'
import log from '../network/log.js'

// Handler sentry configuration
Sentry.init({
	dns: sentry.dsn,
	environment: api.env,
	tracesSampleRate: 1.0,
})

// Error handler and send error data to sentry
export const logErrors = (err, req, res, next) => {
	Sentry.captureException(err)

	log.error(`[${err.name}]: ${err.message}`)
	response.error(res, err.expose, err.status)
}
