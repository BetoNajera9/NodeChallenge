import { MongoClient, ObjectId } from 'mongodb'

import { mongo } from '../config/envServer.js'
import ServerError from '../utils/network/error.js'
import Response from '../utils/network/log.js'

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
				Response.info(`Connected succesfully to ${this.dbName}`)
				MongoLib.connection = this.client.db(this.dbName)
			}
			return MongoLib.connection
		} catch ({ message }) {
			throw new ServerError('Error connection').response()
		}
	}

	async get(collection, query = {}, projection = {}) {
		try {
			const db = await this.connect()
			return await db
				.collection(collection)
				.find(query, { projection })
				.toArray()
		} catch ({ message }) {
			throw new ServerError('Error query get').response()
		}
	}

	async create(collection, data) {
		try {
			const db = await this.connect()
			return await db.collection(collection).insertOne(data)
		} catch ({ message }) {
			throw new ServerError('Error query create').response()
		}
	}

	async update(collection, data, id) {
		try {
			const db = await this.connect()
			console.log(data)
			return await db
				.collection(collection)
				.updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: false })
		} catch ({ message }) {
			console.log(message)
			throw new ServerError('error query update').response(message)
		}
	}

	async delete(collection, id) {
		try {
			const db = await this.connect()
			return await db.collection(collection).deleteOne({ _id: ObjectId(id) })
		} catch ({ message }) {
			throw new ServerError('error query delete').response(message)
		}
	}
}
