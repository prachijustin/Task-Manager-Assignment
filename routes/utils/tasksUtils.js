const Tasks = require('../../models/db').Tasks

exports.getAllTasks = async (req, res) => {
    const tasks = await Tasks.findAll()
    res.status(200).send(tasks)
}


exports.createNewTask = async (req, res) => {
    const newTask = await Tasks.create(
                        {   title: req.body.title,
                            description: req.body.description,
                            dueDate: req.body.dueDate,
                            status: req.body.status,
                            priority: req.body.priority,
                        })
    res.status(200).send('Task created successfully!!' + newTask)
}


exports.getTaskByID = async (req, res) => {
    if(isNaN(parseInt(req.params.id))){
        return res.status(400).send('Task ID should be a number')
    }
    const task = await Tasks.findByPk(req.params.id)
    if(task)
        res.status(200).send(task)
    else
        res.status(404).send(`Task with Task ID ${req.params.id} not found.`)
}


exports.updateTaskByID = async (req, res) => {
    if(isNaN(parseInt(req.params.id))){
        return res.status(400).send('Task ID should be a number')
    }
    const task = await Tasks.findByPk(req.params.id)
    if(task){
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
            res.status(400).send('Task update possible only for "dueDate", "status" and "priority".')
    }       
    else
        res.status(404).send(`Task with Task ID ${req.params.id} not found.`)
}


exports.deleteTaskByID = async(req, res) => {
    if(isNaN(parseInt(req.params.id))){
        return res.status(400).send('Task ID should be a number')
    }
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
}


exports.deleteAllTasks = async (req, res) => {
    const deleteAllTasks = await db.Tasks.destroy({
                        where: {},
                        truncate: true
                    })
    if(deleteAllTasks>0)
        res.status(200).send('All tasks deleted successfully!!')
    else
        res.status(400).send('Error during deleting!!')
}