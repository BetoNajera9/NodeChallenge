import axios from 'axios'

import MongoLib from '../lib/mongo.js'
import ServerError from '../utils/network/error.js'

export default class User {
	constructor() {
		this.collection = 'user'
		this.externalAPI = 'https://reqres.in/api/users'
		this.storage = new MongoLib()
	}

	async externalGetUser(userId) {
		try {
			const res = await axios.get(`${this.externalAPI}/${userId}`)

			return res.data
		} catch (err) {
			if (err.response.status !== 404) {
				throw err
			}
		}
	}

	async getUser(userIds) {
		const user = await this.storage.get(this.collection, {
			_id: { $in: userIds },
		})
		if (!user.length) return undefined
		return user
	}

	async setUser(user) {
		const externalUser = await this.externalGetUser(user._id)

		if (externalUser || (await this.getUser([user._id]))) {
			throw new ServerError(
				'User already exists',
				400,
				'UserExists',
				'UserExists'
			)
		}

		const userId = await this.storage.create(this.collection, user)
		return userId
	}

	async updateUser(user, userId) {
		const externalUser = await this.externalGetUser(userId)

		if (externalUser) {
			throw new ServerError(
				"It's not posible to update user",
				400,
				'InvalidUpdate',
				'InvalidUpdate'
			)
		} else if (!(await this.getUser([userId]))) {
			throw new ServerError(
				"It's not posible to update user",
				400,
				'UserNotFound',
				'UserNotFound'
			)
		}

		const updatedUserId = await this.storage.update(
			this.collection,
			user,
			userId
		)
		return updatedUserId
	}

	async deleteUser(userId) {
		const externalUser = await this.externalGetUser(userId)

		if (externalUser) {
			throw new ServerError(
				"It's not posible to delete user",
				400,
				'InvalidDelete',
				'InvalidDelete'
			)
		} else if (!(await this.getUser([userId]))) {
			throw new ServerError(
				"It's not posible to delete user",
				400,
				'UserNotFound',
				'UserNotFound'
			)
		}

		const deleletedUserId = await this.storage.delete(this.collection, userId)
		return deleletedUserId
	}
}
