const validation = require('../validations/index')

exports.validateTask = async(req, res, next) => {
    try{
        req.dueDate = req.body.dueDate
        req.status = req.body.status      
        req.priority = req.body.priority
        
        if(req.body.dueDate){
            if(!validation.validateDate(req.body.dueDate))
                return res.status(400).send('Due Date is not correct.')
        }
        else
            req.dueDate = undefined
    
        if(req.body.status){
            if(!validation.validateStatus(req.body.status))
                return res.status(400).send('Status is not correct.')
            else
                req.status = req.body.status.charAt(0).toUpperCase() + req.body.status.slice(1)
        }
        else
            req.status = undefined
    
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
  