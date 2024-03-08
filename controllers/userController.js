const User = require("../models/User")

exports.login = (req, res) => {
  let user = new User(req.body)
  user
    .login()
    .then(function (result) {
      res.send(result)
    })
    .catch(function (err) {
      res.send(err)
    })
}
// exports.logout = (req, res){

// }
exports.register = (req, res) => {
  let user = new User(req.body)
  user.register()
  if (user.errors.length) {
    res.send(user.errors)
  } else {
    res.send("no errors")
  }
}
exports.home = (req, res) => {
  res.render("home-guest")
}