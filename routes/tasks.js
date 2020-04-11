const Tasks = require('../db').Tasks
const Notes = require('../db').Notes

const route = require('express').Router()

route.get('/', async (req, res) => {
    const tasks = await Tasks.findAll()
    res.status(200).send(tasks)
})


route.post('/', async (req, res) => {
    const newTask = await Tasks.create(
                        {   title: req.body.title,
                            description: req.body.description,
                            dueDate: req.body.dueDate,
                            status: req.body.status,
                            priority: req.body.priority,
                        })
    res.status(200).send('Task created successfully!!' + newTask)
})


route.get('/:id', async (req, res, next) => {
    if(isNaN(parseInt(req.params.id))){
        res.status(500).send('Task ID should be a number')
    }
    const task = await Tasks.findByPk(req.params.id)
    if(task!=null)
        res.status(200).send(task)
    else
        res.status(404).send(`Task with Task ID ${req.params.id} not found.`)
})


route.get('/:id/notes', async (req, res) => {
    if(isNaN(parseInt(req.params.id))){
        res.status(500).send('Task ID should be a number')
    }
    const task = await Tasks.findByPk(req.params.id, {include: Notes})
    if(task!=null)
        res.status(200).send(task.Notes)
    else
        res.status(404).send(`Notes for Task ID ${req.params.id} not found.`)
})


route.post('/:id/notes', async (req, res) => {
    if(isNaN(parseInt(req.params.id))){
        res.status(500).send('Task ID should be a number')
    }
    const newNote = await Notes.create({
                      TaskTaskID: req.params.id,
                    noteDescription: req.body.noteDescription
                }) 
    res.status(200).send('Note added successfully!!' + newNote)   
})


route.patch('/:id', async (req, res) => {
    if(isNaN(parseInt(req.params.id))){
        res.status(500).send('Task ID should be a number')
    }
    const task = await Tasks.findByPk(req.params.id)
    if(task != null){
        const toUpdate = ['dueDate', 'status', 'priority']
        const isValid = Object.keys(req.body).every(key => toUpdate.includes(key))

        if(isValid){
            const updatedValues = { dueDate: req.body.dueDate,
                            status: req.body.status,
                            priority: req.body.priority }
            const updatedTask = await Tasks.update(updatedValues, { where: {
                                    taskID: req.params.id
                                }});
            if(updatedTask>0)
                res.status(200).send('Task updated successfully!!')
            else
                res.status(400).send('Error during updating task.')
        }
        else
            res.status(400).send('Cannot update specified values of task.')
    }       
    else
        res.status(404).send(`Task with Task ID ${req.params.id} not found.`)
})


route.delete('/:id', async(req, res) => {
    if(isNaN(parseInt(req.params.id))){
        res.status(500).send('Task ID should be a number')
    }
    const task = await Tasks.findByPk(req.params.id)
    if(task!=null){
        const deletedTask = await Tasks.destroy({
                                where: {
                                    taskID: req.params.id
                                }
                            })
        if(deletedTask>0)
            res.status(200).send('Task deleted successfully!!')
        else
            res.status(400).send('Error during deleting task.')
    }
    else
        res.status(404).send(`Task with Task ID ${req.params.id} not found.`)
})


exports = module.exports = route
