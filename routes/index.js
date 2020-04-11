const route = require('express').Router()

route.use('/tasks', require('./tasks'))
route.use('/notes', require('./notes'))

exports = module.exports = {
    route
}