const Notes = require('../models/db').Notes
const Tasks = require('../models/db').Tasks
const { Op } = require('sequelize')
const validation = require('../validations/index')

// Method to retrieve all notes of task with taskid
exports.getNoteByTaskId = async (req, res) => {
    if(validation.validateId(req.params.id)){
        return res.status(400).send('Task ID should be a number')
    }
    try{
        const task = await Tasks.findByPk(req.params.id, {include: Notes})

        // If tasks exists, then only search for notes
        if(task){
            if(task.Notes.length >0)
                res.status(200).send(task.Notes)
            else
                return res.status(404).send("Task doesn't have any Notes")
        }           
        else
            return res.status(404).send(`Task ID ${req.params.id} not found.`)
    }catch{
        return res.status(500).send('Something went wrong. Please try again later.')
    }   
}

// Methdod to create a note for a task with taskid
exports.createNote = async (req, res) => {
    if(validation.validateId(req.params.id)){
        return res.status(400).send('Task ID should be a number')
    }
    try{
        // VAlidate note description before creating note
        const descIsValid = validation.validateTitle(req.body.noteDescription)       
        if(descIsValid){
            await Notes.create({
                TaskTaskID: req.params.id,
                noteDescription: req.body.noteDescription
            }) 
            res.status(200).send('Note created successfully!!')
        }
        else
            return res.status(400).send('Note description cannot be blank.')     
    }catch{
        return res.status(500).send('Something went wrong. Please try again later.')
    }    
}

// Delete all notes for a specific task
exports.deleteNotesByTaskId = async (req, res) => {
    if(validation.validateId(req.params.id)){
        return res.status(400).send('Task ID should be a number')
    }
    try{
        const deletedAllNotes = await Notes.destroy({ 
                                where: {
                                    TaskTaskID: req.params.id
                                }
                            }) 
        if(deletedAllNotes> 0)
            res.status(200).send(`All notes of Task ID ${req.params.id} deleted successfully!!`)
        else
            res.status(400).send('Error while deleting!!')
    }catch{
        return res.status(500).send('Something went wrong. Please try again later.')
    }   
}

// Method to retrieve a specific note of specific task
exports.getNoteByIdByTaskId = async (req, res) => {
    if(validation.validateId(req.params.taskID) || validation.validateId(req.params.id)){
        return res.status(400).send('ID should be a number')
    }
    try{
        // Condition given to match for taskid and noteid given
        const condition =  {
            [Op.and]: [
                { noteID: req.params.id },
                { TaskTaskID: req.params.taskID }
            ]}
        const note = await Notes.findOne({where: condition})
        
        if(note)
            res.status(200).send(note)
        else
            res.status(404).send(`Note with Note ID ${req.params.id} for Task ID ${req.params.taskID} not found.`)
    }catch{
        return res.status(500).send('Something went wrong. Please try again later.')
    }    
}

// Method to delete a specific note of specific task
exports.deleteNoteByIdByTaskId = async (req, res) => {
    if(validation.validateId(req.params.taskID) || validation.validateId(req.params.id)){
        return res.status(400).send('ID should be a number')
    }

    const condition = {
        [Op.and]: [
            { noteID: req.params.id },
            { TaskTaskID: req.params.taskID }
        ]}
    
    try{
        const note = await Notes.findOne({where: condition })    
        if(note){
            const deletedNote = await Notes.destroy({where: condition })
            if(deletedNote>0)
                res.status(200).send('Note deleted successfully!!')
            else
                res.status(400).send('Error during deleting note.')
        }       
        else
            res.status(404).send(`Note with Note ID ${req.params.id} for Task ID ${req.params.taskID} not found.`)
    }catch{
        return res.status(500).send('Something went wrong. Please try again later.')
    }     
}

// Method to update a specific note of specific task
exports.updateNoteByIdByTaskId = async (req, res) => {
    if(validation.validateId(req.params.taskID) || validation.validateId(req.params.id)){
        return res.status(400).send('ID should be a number')
    }

    const condition = {
        [Op.and]: [
            { noteID: req.params.id },
            { TaskTaskID: req.params.taskID }
        ]}
    
    try{
        const note = await Notes.findOne({where: condition })   
        if(note){
            const descIsValid = validation.validateTitle(req.body.noteDescription)       
            if(descIsValid){
                const updatedNote = await Notes.update(
                    {noteDescription: req.body.noteDescription }, 
                    {where: condition })
                if(updatedNote>0)
                    res.status(200).send('Note updated successfully!!')
                else
                    res.status(400).send('Error during updating note.')
            }
            else
                return res.status(400).send('Note description cannot be blank.')     
        }       
        else
            res.status(404).send(`Note with Note ID ${req.params.id} for Task ID ${req.params.taskID} not found.`)
    }catch{
        return res.status(500).send('Something went wrong. Please try again later.')
    }
}