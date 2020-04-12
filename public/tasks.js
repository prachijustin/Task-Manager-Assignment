const fetchTasks = (done) =>{
    $.get('/tasks', (data) => {
        done(data)
    })
}

const successMessage = (message) => {
    alert(message)
}

const createTask = (taskToCreate) =>{
    $.post('/tasks', taskToCreate, () => {
        $('#addTaskModal').modal('toggle')
        successMessage('Task created successfully!!')
        showTasks()
    })
}

const fetchTaskById = (taskid, done) => {
    $.get(`/tasks/${taskid}`, (task) => {
        done(task)
    })
}


const getTaskDetails = (task) =>{
    var title = task.title
    return $(`
        <a href="#" class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${task.title}</h5>
            <small>${task.dueDate}</small>
        </div>
        <button type="button" class="btn btn-success" taskid="${task.taskID}" id="task-notes"">Notes</button>
        <button type="button" class="btn btn-light" taskid="${task.taskID}" id="task-details">More..</button>
        <p class="mb-1">${task.description}</p>
        </a>`)
}

const getFullTask = (task) => {
    return $(`
    <div class="card">
    <div class="card-header">
        <b>TASK ID :</b> ${task.taskID}
        <br>
        <b>TASK :</b>  ${task.title}
    </div>
    <div class="card-body" id="task">
        <p class="card-text"> <b>Description:</b> ${task.description}</p>
        <p class="card-text"> <b>Due Date:</b> ${task.dueDate}</p>
        <p class="card-text"> <b>Status:</b> ${task.status}</p>
        <p class="card-text"> <b>Priority:</b> ${task.priority}</p>
    </div>
    </div>`)
}

$(document).on("click", "#task-notes", (e) => {
    var taskid = $(e.target).attr('taskid')
    let fullTask = $('#full-task')
    let noteCard = $('#notes-list')
    let createNoteCard = $('#create-note')

    fetchNotes((taskid), (notesFound) => {
        noteCard.empty()
        fullTask.empty()
        createNoteCard.empty()
        for(note of notesFound){
            noteCard.append(getNotes(note))
        }
        createNoteCard.append(createNote())
    })  
});


$(document).on("click", "#task-details", (e) => {
    var taskid = $(e.target).attr('taskid')
    let noteCard = $('#notes-list')
    let fullTask = $('#full-task')
    let createNoteCard = $('#create-note')
    
    fetchTaskById((taskid), (taskFound) => {
        fullTask.empty()
        noteCard.empty()
        createNoteCard.empty()
        fullTask.append(getFullTask(taskFound))
    })
});


$(document).on('click', '#add-task', function(){ 
    var taskToCreate = {
        title: $('#task-title').val(),
        description: $('#description').val(),
        dueDate: $('#due-date').val(),
        status: $('#status').val(),
        priority: $('#priority').val()
    }
    createTask(taskToCreate)
});
