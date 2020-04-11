const express = require('express')
const path = require('path')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.send('hello')
})

app.use('/', require('./routes/index').route)

// app.use(require('./routes/notes'))

app.listen(6232, () => console.log('Listening at http://localhost:6232'))