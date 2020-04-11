const express = require('express')
const path = require('path')
const db = require('./models/db').db

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('hello')
})

app.use('/', require('./routes/index').route)

db.sync().then(() => console.log('DB Connected..'))
    .catch(() => console.log('Error during DB connection'))
    
app.listen(6232, () => console.log('Listening at http://localhost:6232'))

