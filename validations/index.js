exports.validateTitle = (title) =>{
    if(title && typeof title === 'string')
        return true
    else
        return false
}

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

exports.validateStatus = (status) => {
    const statusList = ['Incomplete', 'Complete']
    const statusToSet = status.charAt(0).toUpperCase() + status.slice(1)
    if(statusList.includes(statusToSet))
        return true
    else
        return false
}

exports.validatePriority = (priority) => {
    const priorityList = ['Low', 'Medium', 'High']
    const priorityToSet = priority.charAt(0).toUpperCase() + priority.slice(1)
    if(priorityList.includes(priorityToSet))
        return true
    else
        return false
}

exports.validateId = (id) => {
    if(isNaN(parseInt(id)))
        return true
    else
        return false
}

exports.validateUpdateKey = (keys) => {
    const toUpdate = ['dueDate', 'status', 'priority']
    return Object.keys(keys).every(key => toUpdate.includes(key))
}