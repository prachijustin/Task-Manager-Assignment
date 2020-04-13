exports.somethingWrong = (err, res) => {
    return res.status(500).send('Something went wrong. Please try again later.' + err)
}

exports.notFound = (data, res) => {
    return res.status(404).send(`${data} not found`)
}

exports.notFoundById = (data, res, id) => {
    return res.status(404).send(`${data} with ${data} ID ${id} not found.`)
}

exports.notANumber = (data, res) => {
    return res.status(400).send(`${data} ID should be a number`)
}

exports.dataUpdate = (data, work, res) => {
    res.status(400).send(`Error during ${work} ${data}.`)
}