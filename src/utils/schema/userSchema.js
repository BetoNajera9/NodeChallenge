import joi from 'joi'

export const newUser = joi.object({
	email: joi.string().required().email(),
	first_name: joi.string().required().min(4),
	last_name: joi.string().required().min(4),
	company: joi.string(),
	url: joi.string().domain(),
	text: joi.string(),
})

export const updateUser = joi.object({
	email: joi.string().email(),
	first_name: joi.string().min(4),
	last_name: joi.string().min(4),
	company: joi.string(),
	url: joi.string().domain(),
	text: joi.string(),
})

const regexId = '[0-9]+'
const regexIds = `${regexId}(,[0-9]+)+`

export const idsUser = joi.string().regex(new RegExp(regexIds))
export const idUser = joi.string().regex(new RegExp(regexId))
