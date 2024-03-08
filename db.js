const dotenv = require("dotenv")
dotenv.config()
const { MongoClient } = require("mongodb")

const uri = process.env.CONNECTIONSTRING

const client = new MongoClient(uri)

async function start() {
  await client.connect(uri)
  module.exports = client.db()
  const app = require("./app")
  app.listen(process.env.PORT)
}

start()
