const fetchTasks = (done) =>{
    $.get('/tasks', (data) => {
        done(data)
    })
}

const getTaskDetails = (task) =>{
    return $(`
        <a href="#" class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${task.title}</h5>
            <small>${task.dueDate}</small>
        </div>
        <p class="mb-1">${task.description}</p>
        </a>`)
}

$(() => {
    let taskList = $('#task-list')
    fetchTasks((tasks) => {
        taskList.empty()
        for(task of tasks){
            taskList.append(getTaskDetails(task))
        }
    })
})