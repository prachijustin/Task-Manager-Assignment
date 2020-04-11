const Notes = require('../db').Notes
const route = require('express').Router()

route.get('/', async (req, res) => {
    const notes = await Notes.findAll()
    if(notes != null)
        res.status(200).send(notes)
    else
        res.status(404).send('No notes found')
})


route.get('/:id', async (req, res) => {
    if(isNaN(parseInt(req.params.id))){
        return res.status(400).send('Note ID should be a number')
    }
    const note = await Notes.findByPk(req.params.id)
    if(note!=null)
        res.status(200).send(note)
    else
        res.status(404).send(`Note with Note ID ${req.params.id} not found.`)
})


route.delete('/', async (req, res) => {
    const deleteAllNotes = await db.Notes.destroy({
                        where: {},
                        truncate: true
                    })
    if(deleteAllNotes>0)
        res.status(200).send('All notes deleted successfully!!')
    else
        res.status(400).send('Error during deleting!!')
})

exports = module.exports = route
