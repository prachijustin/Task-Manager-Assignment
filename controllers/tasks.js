const Tasks = require('../models/db').Tasks
const validation = require('../validations/index')
const error = require('../error-handling/index')

// Method to get all the tasks
exports.getAllTasks = async (req, res) => {
    try{
        const tasks = await Tasks.findAll()
        if(tasks) res.status(200).send(tasks)
        else error.notFound('Task', res)
    }catch(err){ error.somethingWrong(err, res) }  
}

// Method to create a new task
exports.createTask = async (req, res) => {

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
        else return res.status(400).send('Task title cannot be blank.')
    }catch(err){ error.somethingWrong(err, res) }     
}

// Method to retrieve task by id
exports.getTaskById = async (req, res) => {

    // Validating id if it's a number or not
    if(validation.validateId(req.params.id)) error.notANumber('Task', res)

    try{
        // Finding task by it's id i.e., Primary Key
        const task = await Tasks.findByPk(req.params.id)
        if(task) res.status(200).send(task)
        else error.notFoundById('Task', res, req.params.id)
    }catch(err){ error.somethingWrong(err, res) } 
}

// Method to update a task by id
exports.updateTaskById = async (req, res) => {
    if(validation.validateId(req.params.id)) error.notANumber('Task', res)

    try{
        const task = await Tasks.findByPk(req.params.id)

        // If task of this id exists, then only update it
        if(task){
            if(validation.validateUpdateKey(req.body)){
                const updatedTask = await Tasks.update({
                                        dueDate: req.dueDate,
                                        status: req.status,
                                        priority: req.priority
                                    }, { where: { taskID: req.params.id }});
                if(updatedTask>0) res.status(200).send('Task updated successfully!!')
                else error.dataUpdate('Task', 'updating', res)    
            }
            else res.status(400).send('Task update possible only for "dueDate", "status" and "priority".')
        }
        else error.notFoundById('Task', res, req.params.id)
    }catch(err){ error.somethingWrong(err, res) } 
}

// Method to delete a task by id
exports.deleteTaskById = async(req, res) => {
    if(validation.validateId(req.params.id)) error.notANumber('Task', res)
    
    try{
        const task = await Tasks.findByPk(req.params.id)
        if(task){
            const deletedTask = await Tasks.destroy({ where: { taskID: req.params.id }})
            if(deletedTask>0) res.status(200).send('Task deleted successfully!!')
            else error.dataUpdate('Task', 'deleting', res)
        }
        else error.notFoundById('Task', res, req.params.id)
    }catch(err){ error.somethingWrong(err, res) }   
}

// Method to delete all tasks
exports.deleteAllTasks = async (req, res) => {
    try{
        await db.Tasks.destroy({
            where: {},
            truncate: true
        })
        res.status(200).send('All tasks deleted successfully!!')
    }catch(err){ error.somethingWrong(err, res) } 
}