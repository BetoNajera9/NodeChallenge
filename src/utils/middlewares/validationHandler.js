import log from '../network/log.js'
import ServerError from '../network/error.js'

const validate = (data, schema) => {
	try {
		const val = schema.validate(data)
		return val.error
	} catch ({ message }) {
		log.error(message)
	}
}

export const schemaValidationHandler = (schema, check = 'body') => {
	return (req, res, next) => {
		const error = validate(req[check], schema)
		error
			? next(new ServerError(error.message, 400, 'invalidJSON', 'invalidJSON'))
			: next()
	}
}

export const paramsValidationHandler = (
	schema,
	check,
	parameter = 'params'
) => {
	return (req, res, next) => {
		if (!req[parameter][check])
			next(
				new ServerError(
					'Verify parameters',
					400,
					'InvalidParameter',
					'InvalidParameter'
				)
			)

		const error = validate(req[parameter][check], schema)
		error
			? next(
					new ServerError(
						error.message,
						400,
						'InvalidParameter',
						'InvalidParameter'
					)
			  )
			: next()
	}
}
