import log from '../network/log.js'
import ErrorReq from '../network/error.js'

// validation schema on scope
const validate = (data, schema) => {
	try {
		const { error } = schema.validate(data)
		return error
	} catch ({ message }) {
		log.error(message)
	}
}

// validation error, if it differs of validation schema
const validationHandler = (schema, check = 'body') => {
	return (req, res, next) => {
		const error = validate(req[check], schema)
		error
			? next(new ErrorReq(error.message, 400, 'invalidJSON', 'invalidJSON'))
			: next()
	}
}

export default validationHandler
