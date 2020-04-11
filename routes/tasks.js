const route = require('express').Router()
const tasksUtils = require('./utils/tasksUtils')
const notesUtils = require('./utils/notesUtils')

route.get('/', tasksUtils.getAllTasks)


route.post('/', tasksUtils.createNewTask)


route.get('/:id', tasksUtils.getTaskByID)


route.get('/:id/notes', notesUtils.getNoteByTaskID)


route.post('/:id/notes', notesUtils.createNewNote)


route.delete('/:id/notes', notesUtils.deleteAllNotesByTaskID)


route.patch('/:id', tasksUtils.updateTaskByID)


route.delete('/:id', tasksUtils.deleteTaskByID)


route.get('/:taskID/notes/:id', notesUtils.getNoteByIDByTaskID)


route.delete('/:taskID/notes/:id', notesUtils.deleteNoteByIDByTaskID)


route.patch('/:taskID/notes/:id', notesUtils.updateNoteByIDByTaskID)


route.delete('/', tasksUtils.deleteAllTasks)


exports = module.exports = route
