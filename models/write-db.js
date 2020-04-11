const { db, Tasks, Notes } = require('./db')

// async function task() {
//     //await db.sync()
//     await Tasks.create(
//         {   title: 'First task',
//             description: 'Adding my first task to table',
//             dueDate: '2020-05-13',
//             status: 'Incomplete',
//             priority: 'Low',
//             Notes: [
//                 {noteDescription: 'My first note'}
//             ]
//         }, {
//             include: [Notes]
//         })
//     await Notes.create({ noteDescription: 'My new note', TaskTaskID: 1 })
// } 
// task()

async function task() {
    await db.sync()
    await Tasks.bulkCreate([
        {   title: 'Second task',
            description: 'Adding second task in the table',
            status: 'Incomplete',
            priority: 'High',
        },
        {   title: 'Third task',
            description: 'Adding third task in the table',
            dueDate: '2020-05-09',
            status: 'Complete',
        },
        {   title: 'Fourth task',
        }])
    
    await Notes.bulkCreate([
        {noteDescription: 'My second imp note', TaskTaskID: 2},
        {noteDescription: 'Another note', TaskTaskID: 2},
        {noteDescription: 'My third note', TaskTaskID: 3},
        {noteDescription: 'My fourth imp note', TaskTaskID: 4},
        {noteDescription: 'Fourth note', TaskTaskID: 4},
        {noteDescription: 'Important note', TaskTaskID: 1}
    ])
} 
task()