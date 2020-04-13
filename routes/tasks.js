const route = require('express').Router()
const tasks = require('../controllers/tasks')
const notes = require('../controllers/notes')
const middleware = require('../middlewares/index').validateTask

/*
   ------------ All APIs routing ----------------
*/

// GET: /tasks
route.get('/', tasks.getAllTasks)

// POST: /tasks
route.post('/', middleware, tasks.createTask)

// GET: /tasks/:id
route.get('/:id', tasks.getTaskById)

// GET: /tasks/:id/notes
route.get('/:id/notes', notes.getNoteByTaskId)

// POST /tasks/:id/notes
route.post('/:id/notes', notes.createNote)

// DELETE /tasks/:id/notes
route.delete('/:id/notes', notes.deleteNotesByTaskId)

// PATCH /tasks/:id
route.patch('/:id', middleware, tasks.updateTaskById)

// DELETE /tasks/:id
route.delete('/:id', tasks.deleteTaskById)

// GET /tasks/:taskid/notes/:noteid
route.get('/:taskID/notes/:id', notes.getNoteByIdByTaskId)

// DELETE /tasks/:taskid/notes/:noteid
route.delete('/:taskID/notes/:id', notes.deleteNoteByIdByTaskId)

// PATCH: /tasks/:taskid/notes/:noteid
route.patch('/:taskID/notes/:id', notes.updateNoteByIdByTaskId)

// DELETE: /tasks
route.delete('/', tasks.deleteAllTasks)


exports = module.exports = route
