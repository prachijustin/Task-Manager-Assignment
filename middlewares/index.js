const validation = require('../validations/index')

/*
    --- Middleware through which create and update task API must go through----
*/
exports.validateTask = async(req, res, next) => {
    try{
        req.dueDate = req.body.dueDate
        req.status = req.body.status      
        req.priority = req.body.priority
        
        // If duedate is given, use it, else use default duedate value provided in Models
        if(req.body.dueDate){
            if(!validation.validateDate(req.body.dueDate))
                return res.status(400).send('Due Date is not correct.')
        }
        else
            req.dueDate = undefined
    

        // If status is given, use it, else use default status value provided in Models
        if(req.body.status){
            if(!validation.validateStatus(req.body.status))
                return res.status(400).send('Status is not correct.')
            else
                req.status = req.body.status.charAt(0).toUpperCase() + req.body.status.slice(1)
        }
        else
            req.status = undefined
    
        
        // If priority is given, use it, else use default priority value provided in Models
        if(req.body.priority){
            if(!validation.validatePriority(req.body.priority))
                return res.status(400).send('Priority is not correct.')
            else
                req.priority = req.body.priority.charAt(0).toUpperCase() + req.body.priority.slice(1)
        }
        else
            req.priority = undefined
        
        next()

    }catch{
        return res.status(400).send("There's some error handling the middleware")
    }   
}
  