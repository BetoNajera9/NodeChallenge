import { MongoClient } from 'mongodb'

import { mongo } from '../config/envServer.js'
import ServerError from '../utils/network/error.js'
import log from '../utils/network/log.js'

const USER = encodeURIComponent(mongo.user)
const PASSWORD = encodeURIComponent(mongo.password)
const HOST = mongo.host
const DB = mongo.db
const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${HOST}/${DB}?retryWrites=true&w=majority`

export default class MongoLib {
	constructor() {
		this.client = new MongoClient(MONGO_URI, { useUnifiedTopology: true })
		this.dbName = DB
	}

	async connect() {
		try {
			if (!MongoLib.connection) {
				await this.client.connect()
				log.success(`Connected succesfully to ${this.dbName}`)
				MongoLib.connection = this.client.db(this.dbName)
			}
			return MongoLib.connection
		} catch ({ message }) {
			log.error(message)
			throw new ServerError(message, 500)
		}
	}

	async get(collection, query = {}, projection = {}) {
		const db = await this.connect()
		return await db.collection(collection).find(query, { projection }).toArray()
	}

	async create(collection, data) {
		const db = await this.connect()
		return await db.collection(collection).insertOne(data)
	}

	async update(collection, data, id) {
		const db = await this.connect()
		return await db
			.collection(collection)
			.updateOne({ _id: id }, { $set: data }, { upsert: false })
	}

	async delete(collection, id) {
		const db = await this.connect()
		return await db.collection(collection).deleteOne({ _id: id })
	}
}
