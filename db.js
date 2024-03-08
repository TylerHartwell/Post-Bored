const { MongoClient } = require("mongodb")

const uri =
  "mongodb+srv://thartwell37:gLKOWcnWONmCvLSs@cluster0.ve0pguw.mongodb.net/ComplexApp?retryWrites=true&w=majority&appName=Cluster0"

const client = new MongoClient(uri)

async function start() {
  await client.connect(uri)
  module.exports = client.db()
  const app = require("./app")
  app.listen(3000)
}

start()
