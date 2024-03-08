const bcrypt = require("bcryptjs")
const userCollection = require("../db").collection("users")
const validator = require("validator")

let User = function (data) {
  this.data = data
  this.errors = []
}

User.prototype.cleanUp = function () {
  if (typeof this.data.username != "string") {
    this.data.username = ""
  }
  if (typeof this.data.email != "string") {
    this.data.email = ""
  }
  if (typeof this.data.password != "string") {
    this.data.password = ""
  }

  //get rid of any extra bogues properties
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password
  }
}

User.prototype.validate = function () {
  if (this.data.username == "") {
    this.errors.push("You must provide a username.")
  }
  if (
    this.data.username != "" &&
    !validator.isAlphanumeric(this.data.username)
  ) {
    this.errors.push("Username can only contain letters and numbers")
  }
  if (!validator.isEmail(this.data.email)) {
    this.errors.push("You must provide a valid email address.")
  }
  if (this.data.password == "") {
    this.errors.push("You must provide a password.")
  }
  if (this.data.password.length > 0 && this.data.password.length < 12) {
    this.errors.push("Password must be at least 12 characters")
  }
  if (this.data.password.length > 50) {
    this.errors.push("Password must not exceed 50 characters")
  }
  if (this.data.username.length > 0 && this.data.username.length < 3) {
    this.errors.push("Username must be at least 3 characters")
  }
  if (this.data.username.length > 30) {
    this.errors.push("Username must not exceed 30 characters")
  }
}

User.prototype.login = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp()
    const attemptedUser = await userCollection.findOne({
      username: this.data.username
    })

    if (
      attemptedUser &&
      bcrypt.compareSync(this.data.password, attemptedUser.password)
    ) {
      resolve("Congrats")
    } else {
      reject("Invalid username / password")
    }
  })
}

User.prototype.register = function () {
  //validate user data
  this.cleanUp()
  this.validate()

  //if no validation errors, save user data into a database
  if (!this.errors.length) {
    //hash password
    let salt = bcrypt.genSaltSync(10)
    this.data.password = bcrypt.hashSync(this.data.password, salt)
    userCollection.insertOne(this.data)
  }
}

module.exports = User
