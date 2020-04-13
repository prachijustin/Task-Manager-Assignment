/*
    All data validations
*/

// Validating if passed param is not empty and is a string
exports.validateTitle = (title) =>{
    if(title && typeof title === 'string')
        return true
    else
        return false
}

// Validating if the input date is a correct date
exports.validateDate = (date) =>{  
    var regEx = /^\d{4}-\d{2}-\d{2}$/
    if(!date.match(regEx)) 
        return false
    var convertedDate = new Date(date)
    var time = convertedDate.getTime();
    if(!time && time !== 0) 
        return false
    return convertedDate.toISOString().slice(0,10) === date;
}

// Validating if the status passed is correct
exports.validateStatus = (status) => {
    const statusList = ['Incomplete', 'Complete']
    const statusToSet = status.charAt(0).toUpperCase() + status.slice(1)
    if(statusList.includes(statusToSet))
        return true
    else
        return false
}

// Validating if the priority passed is correct
exports.validatePriority = (priority) => {
    const priorityList = ['Low', 'Medium', 'High']
    const priorityToSet = priority.charAt(0).toUpperCase() + priority.slice(1)
    if(priorityList.includes(priorityToSet))
        return true
    else
        return false
}

// Validating if the id passed is a number
exports.validateId = (id) => {
    if(isNaN(parseInt(id)))
        return true
    else
        return false
}

// Validating if the values of task trying to update is valid
exports.validateUpdateKey = (keys) => {
    const toUpdate = ['dueDate', 'status', 'priority']
    return Object.keys(keys).every(key => toUpdate.includes(key))
}