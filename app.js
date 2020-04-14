const express = require('express')
const path = require('path')
const db = require('./models/db').db

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/index').route)

var port = process.env.PORT || 3000

db.sync()
    .then(() => {
        console.log('DB Connected..')
        app.listen(port, () => console.log(`Listening at http://localhost:${port}`))
    })
    .catch(() => console.log('Error during DB connection'))
    


