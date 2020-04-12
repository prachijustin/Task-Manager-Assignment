const Tasks = require('../models/db').Tasks
const validation = require('../validations/index')

exports.getAllTasks = async (req, res) => {
    try{
        const tasks = await Tasks.findAll()
        if(tasks)
            res.status(200).send(tasks)
        else
            res.status(404).send('No tasks found.')
    }catch{
        return res.status(400).send('Error during retrieval')
    }   
}


exports.createTask = async (req, res, next) => {
    const titleIsValid = validation.validateTitle(req.body.title)
    try{      
        if(titleIsValid){
            await Tasks.create({
                title: req.body.title,
                description: req.body.description,
                dueDate: req.dueDate,
                status: req.status,
                priority: req.priority
            })              
            res.status(201).send('Task created successfully!!')
        }
        else
            return res.status(400).send('Task title cannot be blank.')
    }catch(err){
        return res.status(500).send('Something went wrong. Please try again later.' + err)
    }     
}


exports.getTaskById = async (req, res) => {
    if(validation.validateId(req.params.id)){
        return res.status(400).send('Task ID should be a number')
    }
    try{
        const task = await Tasks.findByPk(req.params.id)
        if(task)
            res.status(200).send(task)
        else
            res.status(404).send(`Task with Task ID ${req.params.id} not found.`)
    }catch{
        return res.status(500).send('Something went wrong. Please try again later.')
    }
}


exports.updateTaskById = async (req, res) => {
    if(validation.validateId(req.params.id)){
        return res.status(400).send('Task ID should be a number')
    }
    try{
        const task = await Tasks.findByPk(req.params.id)
        if(task){
            if(validation.validateUpdateKey(req.body)){
                const updatedTask = await Tasks.update({
                                        dueDate: req.dueDate,
                                        status: req.status,
                                        priority: req.priority
                                    }, 
                                    { where: {
                                        taskID: req.params.id
                                    }});
                if(updatedTask>0)
                    res.status(200).send('Task updated successfully!!')
                else
                    res.status(400).send('Error during updating task.')            
            }
            else
                res.status(400).send('Task update possible only for "dueDate", "status" and "priority".')
        }
        else
            res.status(404).send(`Task with Task ID ${req.params.id} not found.`)       
    }catch{
        return res.status(500).send('Something went wrong. Please try again later.')
    }
}


exports.deleteTaskById = async(req, res) => {
    if(validation.validateId(req.params.id)){
        return res.status(400).send('Task ID should be a number')
    }
    try{
        const task = await Tasks.findByPk(req.params.id)
        if(task){
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
    }catch{
        return res.status(500).send('Something went wrong. Please try again later.')
    }   
}


exports.deleteAllTasks = async (req, res) => {
    try{
        await db.Tasks.destroy({
            where: {},
            truncate: true
        })
        res.status(200).send('All tasks deleted successfully!!')
    }catch{
        return res.status(500).send('Something went wrong. Please try again later.')
    }    
}