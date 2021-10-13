import express from 'express'

import { api } from '../config/envServer.js'
import validationHandler from '../utils/middlewares/validationHandler.js'
import * as user from '../utils/schema/userSchema.js'
import UserService from '../services/user.js'
import response from '../utils/network/response.js'
import ServerError from '../utils/network/error.js'

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

router.get('/user/:ids', async (req, res, next) => {
	try {
		let success = []
		const ids = req.params.ids.split(',')
		const idsInt = await Promise.all(
			ids.map(async (id) => {
				if (isNaN(id)) {
					throw new ServerError(
						'Need to check the parameter',
						400,
						'InvalidParameter',
						'InvalidParameter'
					)
				}
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
})

router.post(
	'/user/:id',
	validationHandler(user.newUser),
	async (req, res, next) => {
		try {
			if (req.params.id && !isNaN(req.params.id)) {
				const data = { _id: parseInt(req.params.id), ...req.body }
				await userService.setUser(data)

				response.succes(
					res,
					`User ${req.body.first_name} was create`,
					data,
					201
				)
			} else {
				throw new ServerError(
					'Need to check the parameter',
					400,
					'InvalidParameter',
					'InvalidParameter'
				)
			}
		} catch (err) {
			next(err)
		}
	}
)

router.put(
	'/user/:id',
	validationHandler(user.updateUser),
	async (req, res, next) => {
		try {
			if (!isNaN(req.params.id)) {
				const data = await userService.updateUser(
					req.body,
					parseInt(req.params.id)
				)

				response.succes(res, `User ${req.params.id} updated`, data)
			} else {
				throw new ServerError(
					'Need to check the parameter',
					400,
					'InvalidParameter',
					'InvalidParameter'
				)
			}
		} catch (err) {
			next(err)
		}
	}
)

router.delete('/user/:id', async (req, res, next) => {
	try {
		if (!isNaN(req.params.id)) {
			const data = await userService.deleteUser(parseInt(req.params.id))

			response.succes(res, `User ${req.params.id} deleted`, data)
		} else {
			throw new ServerError(
				'Need to check the parameter',
				400,
				'InvalidParameter',
				'InvalidParameter'
			)
		}
	} catch (err) {
		next(err)
	}
})

export default router
