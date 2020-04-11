const { db, Tasks, Notes } = require('./db')
const Sequelize = require('sequelize')

async function task(){
    const tasks = await Tasks.findAll({
        attributes: ['title', 'dueDate', 'priority'],
        include: Notes
    })

    console.log('Title \t\t | DueDate \t | Priority')
    for (let task of tasks) {
        console.log('=======================')
        console.log(`${task.title} \t | ${task.dueDate} \t | ${task.priority}`)
        console.log('--- Notes ---')
        for(let note in task.Notes){
            console.log(task.Notes[note].noteDescription)
        }
        console.log('=======================')
    }
}


task()