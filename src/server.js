import express from 'express'
import cors from 'cors'

import { api } from './config/envServer.js'
import routes from './routes/index.js'
import { logErrors } from './utils/middlewares/errorsHandler.js'

const app = express()

// Middlewares
if (api.env !== 'production') {
	app.use(express.json())
	app.use(cors('*'))
} else {
	const helmet = require('helmet')

	app.use(cors(api.cors))
	app.use(helmet())
	app.use(helmet.permittedCrossDomainPolicies())
	app.disable('x-powered-by')
}

// Routes
app.get('/', (req, res, next) => {
	res.redirect('/api')
})
app.use('/api', routes)

// Handler Error
app.use(logErrors)

if (api.env !== 'test') {
	app.listen(api.port, (err) => {
		if (err) console.error(err)
		else if (api.env !== 'production')
			console.log(`=> Server on http://localhost:${api.port}`)
		else console.log(`=> Server on ${api.server}`)
	})
}

export default app
