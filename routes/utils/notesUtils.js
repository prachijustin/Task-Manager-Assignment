const Notes = require('../../models/db').Notes
const Tasks = require('../../models/db').Tasks
const { Op } = require('sequelize')

exports.getAllNotes = async (req, res) => {
     const notes = await Notes.findAll()
    if(notes)
        res.status(200).send(notes)
    else
        res.status(404).send('No notes found')
}


exports.getNoteByID = async (req, res) => {
    if(isNaN(parseInt(req.params.id))){
        return res.status(400).send('Note ID should be a number')
    }
    const note = await Notes.findByPk(req.params.id)
    if(note)
        res.status(200).send(note)
    else
        res.status(404).send(`Note with Note ID ${req.params.id} not found.`)
}


exports.deleteAllNotes = async (req, res) => {
    const deleteAllNotes = await db.Notes.destroy({
                        where: {},
                        truncate: true
                    })
    if(deleteAllNotes>0)
        res.status(200).send('All notes deleted successfully!!')
    else
        res.status(400).send('Error during deleting!!')
}


exports.getNoteByTaskID = async (req, res) => {
    if(isNaN(parseInt(req.params.id))){
        return res.status(400).send('Task ID should be a number')
    }
    const task = await Tasks.findByPk(req.params.id, {include: Notes})
    if(task)
        res.status(200).send(task.Notes)
    else
        res.status(404).send(`Notes for Task ID ${req.params.id} not found.`)
}


exports.createNewNote = async (req, res) => {
    if(isNaN(parseInt(req.params.id))){
        return res.status(400).send('Task ID should be a number')
    }
    const newNote = await Notes.create({
                      TaskTaskID: req.params.id,
                    noteDescription: req.body.noteDescription
                }) 
    res.status(200).send('Note added successfully!!' + newNote)   
}


exports.deleteAllNotesByTaskID = async (req, res) => {
    if(isNaN(parseInt(req.params.id))){
        return res.status(400).send('Task ID should be a number')
    }
    const deletedAllNotes = await Notes.destroy({ where: {
                                    TaskTaskID: req.params.id
                                }
                            }) 
    if(deletedAllNotes> 0)
        res.status(200).send(`All notes of Task ID ${req.params.id} deleted successfully!!`)
    else
        res.status(400).send('Error while deleting!!')
}


exports.getNoteByIDByTaskID = async (req, res) => {
    if(isNaN(parseInt(req.params.taskID)) || isNaN(parseInt(req.params.id))){
        return res.status(400).send('ID should be a number')
    }

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
}


exports.deleteNoteByIDByTaskID = async (req, res) => {
    if(isNaN(parseInt(req.params.taskID)) || isNaN(parseInt(req.params.id))){
        return res.status(400).send('ID should be a number')
    }

    const condition = {
        [Op.and]: [
            { noteID: req.params.id },
            { TaskTaskID: req.params.taskID }
        ]}

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
}


exports.updateNoteByIDByTaskID = async (req, res) => {
    if(isNaN(parseInt(req.params.taskID)) || isNaN(parseInt(req.params.id))){
        return res.status(400).send('ID should be a number')
    }

    const condition = {
        [Op.and]: [
            { noteID: req.params.id },
            { TaskTaskID: req.params.taskID }
        ]}
    const note = await Notes.findOne({where: condition })
    
    if(note){
        const updatedNote = await Notes.update(
            {noteDescription: req.body.noteDescription }, 
            {where: condition })
        if(updatedNote>0)
            res.status(200).send('Note updated successfully!!')
        else
            res.status(400).send('Error during updating note.')
    }       
    else
        res.status(404).send(`Note with Note ID ${req.params.id} for Task ID ${req.params.taskID} not found.`)
}