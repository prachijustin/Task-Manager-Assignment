const route = require('express').Router()
const notesUtils = require('./utils/notesUtils')

route.get('/', notesUtils.getAllNotes)

route.get('/:id', notesUtils.getNoteByID)

route.delete('/', notesUtils.deleteAllNotes)

exports = module.exports = route
