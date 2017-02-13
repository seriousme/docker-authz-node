// implementation of the Docker authz plugin protocol documented at
// https://docs.docker.com/engine/extend/plugins_authorization/

const AuthzPort = 9000
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const handshakeMsg = {
  'Implements': ['authz']
}
// example responses
const allowedMsg = { 'allow': true }
const deniedMsg = {
  'allow': false,
  'msg': 'access denied by authorization plugin'
}
const errorMsg = {
  'err': 'authorization plugin failed'
}

app.use(bodyParser.json({'type': () => { return true }}))

// intialization handshake
// see https://docs.docker.com/engine/extend/plugin_api/#plugin-discovery
app.use('/Plugin.Activate', function (req, res, next) {
  res.send(handshakeMsg)
  next()
})

// validation on request
// Docker sends request containing
// {
//     "User":              "The user identification",
//     "UserAuthNMethod":   "The authentication method used",
//     "RequestMethod":     "The HTTP method",
//     "RequestURI":        "The HTTP request URI",
//     "RequestBody":       "Byte array containing the raw HTTP request body",
//     "RequestHeader":     "Byte array containing the raw HTTP request header as a map[string][]string "
// }
app.use('/AuthZPlugin.AuthZReq', function (req, res, next) {
  var msg = allowedMsg
  console.log(req.body)
  if (req.body.RequestUri === '/v1.26/containers/json') {
    msg = deniedMsg
    msg.msg = 'forbidden to list containers'
  }
  res.send(msg)
  next()
})

// validation on response
// {
//    "User":              "The user identification",
//    "UserAuthNMethod":   "The authentication method used",
//    "RequestMethod":     "The HTTP method",
//    "RequestURI":        "The HTTP request URI",
//    "RequestBody":       "Byte array containing the raw HTTP request body",
//    "RequestHeader":     "Byte array containing the raw HTTP request header as a map[string][]string",
//    "ResponseBody":      "Byte array containing the raw HTTP response body",
//    "ResponseHeader":    "Byte array containing the raw HTTP response header as a map[string][]string",
//    "ResponseStatusCode":"Response status code"
//  }

app.use('/AuthZPlugin.AuthZRes', function (req, res, next) {
  console.log(req.body)
  res.send(allowedMsg)
  next()
})

app.listen(AuthzPort)
