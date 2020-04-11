const route = require('express').Router()
const tasks = require('../controllers/tasks')
const notes = require('../controllers/notes')

route.get('/', tasks.getAllTasks)


route.post('/', tasks.createTask)


route.get('/:id', tasks.getTaskById)


route.get('/:id/notes', notes.getNoteByTaskId)


route.post('/:id/notes', notes.createNote)


route.delete('/:id/notes', notes.deleteNotesByTaskId)


route.patch('/:id', tasks.updateTaskById)


route.delete('/:id', tasks.deleteTaskById)


route.get('/:taskID/notes/:id', notes.getNoteByIdByTaskId)


route.delete('/:taskID/notes/:id', notes.deleteNoteByIdByTaskId)


route.patch('/:taskID/notes/:id', notes.updateNoteByIdByTaskId)


route.delete('/', tasks.deleteAllTasks)


exports = module.exports = route
