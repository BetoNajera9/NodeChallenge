// Dependencies error handler
import * as sentry from '@sentry/node'

// Other dependencies
import { api, sentryDns } from '../../config/envServer.js'

// Handler sentry configuration
sentry.init({
	dns: sentryDns,
	environment: api.env,
	tracesSampleRate: 1.0,
})

// Error handler and send error data to sentry
export const logErrors = (err, req, res, next) => {
	sentry.captureException(err)

	res.status(err.status).send({
		error: true,
		status: res.status,
		message: err.message,
	})
}
