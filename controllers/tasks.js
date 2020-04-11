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


exports.createTask = async (req, res) => {
    const titleIsValid = validation.validateTitle(req.body.title)
    try{      
        if(titleIsValid){
            var newTask = {
                title: req.body.title,
                description: req.body.description,
                dueDate: req.body.dueDate,
                status: req.body.status,
                priority: req.body.priority
            }
            
            if(req.body.dueDate){
                if(!validation.validateDate(req.body.dueDate))
                    return res.status(400).send('Due Date is not correct.')
            }
            else
                newTask.dueDate = undefined

            if(req.body.status){
                if(!validation.validateStatus(req.body.status))
                    return res.status(400).send('Status is not correct.')
                else
                    newTask.status = req.body.status.charAt(0).toUpperCase() + req.body.status.slice(1)
            }
            else
                newTask.status = undefined

            if(req.body.priority){
                if(!validation.validatePriority(req.body.priority))
                    return res.status(400).send('Priority is not correct.')
                else
                    newTask.priority = req.body.priority.charAt(0).toUpperCase() + req.body.priority.slice(1)
            }
            else
                newTask.priority = undefined

            await Tasks.create(newTask)              
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
                var updatedValues = {
                    dueDate: req.body.dueDate,
                    status: req.body.status,
                    priority: req.body.priority
                }

                if(req.body.dueDate){
                    if(!validation.validateDate(req.body.dueDate))
                        return res.status(400).send('Due Date is not correct.')
                }
                else
                    updatedValues.dueDate = undefined
    
                if(req.body.status){
                    if(!validation.validateStatus(req.body.status))
                        return res.status(400).send('Status is not correct.')
                    else
                        updatedValues.status = req.body.status.charAt(0).toUpperCase() + req.body.status.slice(1)
                }
                else
                    updatedValues.status = undefined
    
                if(req.body.priority){
                    if(!validation.validatePriority(req.body.priority))
                        return res.status(400).send('Priority is not correct.')
                    else
                        updatedValues.priority = req.body.priority.charAt(0).toUpperCase() + req.body.priority.slice(1)
                }
                else
                    updatedValues.priority = undefined
              
                
                const updatedTask = await Tasks.update(updatedValues, 
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