const route = require('express').Router()
const notes = require('../controllers/notes')

route.get('/', notes.getAllNotes)

route.get('/:id', notes.getNoteById)

route.delete('/', notes.deleteAllNotes)

exports = module.exports = route
