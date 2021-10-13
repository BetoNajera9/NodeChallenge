import 'dotenv/config'

export const api = {
	name: process.env.APP_NAME || '',
	server: process.env.SERVER_URL || '',
	env: process.env.NODE_ENV || 'development',
	port: process.env.PORT || '3000',
	cors: process.env.CORS || '',
}

export const mongo = {
	user: process.env.MONGO_USER,
	password: process.env.MONGO_PASSWORD,
	host: process.env.MONGO_HOST,
	db: process.env.MONGO_DB,
}

export const sentry = {
	dsn: process.env.SENTRY_DSN || '',
	id: process.env.SENTRY_ID || '',
}
