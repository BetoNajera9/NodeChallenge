import express from 'express'
import UserService from '../services/user.js'
import response from '../utils/network/response.js'
import ServerError from '../utils/network/error.js'
import { api } from '../config/envServer.js'
import * as user from '../utils/schema/userSchema.js'
import {
	schemaValidationHandler,
	paramsValidationHandler,
} from '../utils/middlewares/validationHandler.js'

const router = new express.Router()
const userService = new UserService()

router.get('/', async (req, res, next) => {
	res.send({
		ProjectName: api.name,
		Server: api.server,
		Repository: 'https://github.com/betonajera9/NodeChallenge',
		Author: 'Beto Najera',
	})
})

router.get(
	'/user/:ids',
	paramsValidationHandler(user.idsUser, 'ids'),
	async (req, res, next) => {
		try {
			let success = []
			const ids = req.params.ids.split(',')
			const idsInt = await Promise.all(
				ids.map(async (id) => {
					const external = await userService.externalGetUser(id)
					if (!external) {
						return parseInt(id)
					}
					success.push(external.data)
				})
			)

			const data = await userService.getUser(idsInt)

			if (data) {
				success = [...data, ...success]
			}
			if (!success.length) {
				throw new ServerError(
					'User not found',
					400,
					'UserNotFound',
					'UserNotFound'
				)
			} else if (ids.length !== success.length) {
				response.succes(
					res,
					`WARNING: Success response with warning`,
					success,
					206
				)
			} else {
				response.succes(res, `User ${ids} obtained`, success)
			}
		} catch (err) {
			next(err)
		}
	}
)

router.post(
	'/user/:id',
	paramsValidationHandler(user.idUser, 'id'),
	schemaValidationHandler(user.newUser),
	async (req, res, next) => {
		try {
			const data = { _id: parseInt(req.params.id), ...req.body }
			await userService.setUser(data)

			response.succes(res, `User ${req.body.first_name} was create`, data, 201)
		} catch (err) {
			next(err)
		}
	}
)

router.put(
	'/user/:id',
	paramsValidationHandler(user.idUser, 'id'),
	schemaValidationHandler(user.updateUser),
	async (req, res, next) => {
		try {
			const data = await userService.updateUser(
				req.body,
				parseInt(req.params.id)
			)

			response.succes(res, `User ${req.params.id} updated`, data)
		} catch (err) {
			next(err)
		}
	}
)

router.delete(
	'/user/:id',
	paramsValidationHandler(user.idUser, 'id'),
	async (req, res, next) => {
		try {
			const data = await userService.deleteUser(parseInt(req.params.id))

			response.succes(res, `User ${req.params.id} deleted`, data)
		} catch (err) {
			next(err)
		}
	}
)

export default router
