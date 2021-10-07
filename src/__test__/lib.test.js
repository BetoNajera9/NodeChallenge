import Lib from '../lib/mongo.js'

const lib = new Lib()

test('lib connection ', async () => {
	const result = await lib.connect()
	console.log(result)
	expect(result)
})
