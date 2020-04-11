const Notes = require('../models/db').Notes
const Tasks = require('../models/db').Tasks
const { Op } = require('sequelize')
const validation = require('../validations/index')


exports.getAllNotes = async (req, res) => {
    try{
        const notes = await Notes.findAll()
        if(notes)
            res.status(200).send(notes)
        else
            res.status(404).send('No notes found')
    }catch{
        return res.status(400).send('Error during retrieval')
    }    
}


exports.getNoteById = async (req, res) => {
    if(validation.validateId(req.params.id)){
        return res.status(400).send('Note ID should be a number')
    }
    try{
        const note = await Notes.findByPk(req.params.id)
        if(note)
            res.status(200).send(note)
        else
            res.status(404).send(`Note with Note ID ${req.params.id} not found.`)
    }catch{
        return res.status(500).send('Something went wrong. Please try again later.')
    }   
}


exports.deleteAllNotes = async (req, res) => {
    try{
        await db.Notes.destroy({
            where: {},
            truncate: true
        })
        res.status(200).send('All notes deleted successfully!!')
    }catch{
        return res.status(500).send('Something went wrong. Please try again later.')
    }
}


exports.getNoteByTaskId = async (req, res) => {
    if(validation.validateId(req.params.id)){
        return res.status(400).send('Task ID should be a number')
    }
    try{
        const task = await Tasks.findByPk(req.params.id, {include: Notes})
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


exports.createNote = async (req, res) => {
    if(validation.validateId(req.params.id)){
        return res.status(400).send('Task ID should be a number')
    }
    try{
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


exports.getNoteByIdByTaskId = async (req, res) => {
    if(validation.validateId(req.params.taskID) || validation.validateId(req.params.id)){
        return res.status(400).send('ID should be a number')
    }
    try{
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