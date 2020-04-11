const route = require('express').Router()

route.use('/tasks', require('./tasks'))

exports = module.exports = {
    route
}