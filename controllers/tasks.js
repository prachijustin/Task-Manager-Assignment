const Tasks = require('../models/db').Tasks
const validation = require('../validations/index')

// Method to get all the tasks
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

// Method to create a new task
exports.createTask = async (req, res, next) => {

    // Validating task title before creating new task
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

// Method to retrieve task by id
exports.getTaskById = async (req, res) => {

    // Validating id if it's a number or not
    if(validation.validateId(req.params.id)){
        return res.status(400).send('Task ID should be a number')
    }
    try{
        // Finding task by it's id i.e., Primary Key
        const task = await Tasks.findByPk(req.params.id)
        if(task)
            res.status(200).send(task)
        else
            res.status(404).send(`Task with Task ID ${req.params.id} not found.`)
    }catch{
        return res.status(500).send('Something went wrong. Please try again later.')
    }
}

// Method to update a task by id
exports.updateTaskById = async (req, res) => {
    if(validation.validateId(req.params.id)){
        return res.status(400).send('Task ID should be a number')
    }
    try{
        const task = await Tasks.findByPk(req.params.id)

        // If task of this id exists, then only update it
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

// Method to delete a task by id
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

// Method to delete all tasks
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