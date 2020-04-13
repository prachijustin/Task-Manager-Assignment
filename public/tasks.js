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
        $('#addTaskModal').find("input,textarea").val('')

        $('#task-title').css({
            'border' : '1px solid #ced4da'
        })
        $('#req').css({
            'display' : 'none'
        })

        var tomorrow = new Date();
        tomorrow.setDate(new Date().getDate()+1);

        var finalDate = tomorrow.toISOString().split('T')[0]
        $('#addTaskModal #due-date').val(finalDate);
        showTasks()
    })
}

const fetchTaskById = (taskid, done) => {
    $.get(`/tasks/${taskid}`, (task) => {
        done(task)
    })
}

const deleteTask = (taskid) => {
    $.ajax({
        url: `/tasks/${taskid}`,
        type: 'DELETE',
        success: () =>{
            alert('Task deleted successfully.')
            let fullTask = $('#full-task')
            fullTask.empty()
            showTasks()
        }
    });
}


const editTask = (taskid, dueDate, checked, priority) => {
    $.ajax({
        url: `/tasks/${taskid}`,
        type: 'PATCH',
        data: {
            dueDate: dueDate,
            status: checked,
            priority: priority
        },
        success: () =>{
            alert('Task edited successfully.')
            $('#editTaskModal').modal('toggle')
            let fullTask = $('#full-task')
            fullTask.empty()
            fetchTaskById((taskid), (taskFound) => {
                fullTask.append(getFullTask(taskFound))
            })
        }
    });
}



const deleteAllTasks = () => {
    $.ajax({
        url: '/tasks',
        type: 'DELETE',
        success: () =>{
            alert('All tasks deleted successfully.')
            showTasks()
        }
    });
}


const getTaskDetails = (task) =>{
    return $(`
        <a href="#" class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1" style="font-family: cursive; font-weight: 600; font-size: 20px;">${task.title}</h5>
            <small>Due Date: ${task.dueDate}</small>
        </div>
        <button type="button" class="btn btn-success" taskid="${task.taskID}" id="task-notes" style="margin: 5px;">Notes</button>
        <button type="button" class="btn btn-light" taskid="${task.taskID}" id="task-details" style="margin: 5px;">More</button>       
        <p class="mb-1" >Priority: <b> ${task.priority} </b></p>
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
            <div class="row" style="float: right;">            
            <button type="button" id="btn-edit-task" taskid="${task.taskID}" class="btn btn-warning" style="margin:5px;">Edit</button>
            <button type="button" id="btn-delete-task" taskid="${task.taskID}" class="btn btn-danger" style="margin:5px;">Delete</button>
            </div>      
        </div>
        
    </div>`)
}


const editTaskCard = (task) => {
    return $(`
    <div class="note-div">
        <h4> EDIT TASK </h4>
        <br>
        <div class="form-row">
        <div class="form-group">
            <label for="due-date">Due Date:</label>
            <input type="date" class="form-control" id="due-date" value="${task.dueDate}"></input>
        </div>
        <div class="form-group">
            <label for="status">Status:  </label>
            <div class="form-check form-check-inline">
                <input class="form-check-input" name="status" type="checkbox" id="status" value="Incomplete">
                <label class="form-check-label" for="incompleteCheck">Incomplete</label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" name="status" type="checkbox" id="status" value="Complete">
                <label class="form-check-label" for="completeCheck">Complete</label>
            </div>
        </div>
      <div class="form-group">
        <label for="priority" class="col-form-label">Priority:</label>
        <select class="custom-select" id="prioritySelect">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
      </div>
        </div>
        <button type="button" id="note-btn" taskid="${task.taskID}" class="btn btn-success">SAVE</button>
    </div>`)
}

$(document).on("click", "#task-notes", (e) => {
    taskNotes(e)
});


$(document).on("click", "#task-details", (e) => {
    var taskid = $(e.target).attr('taskid')
    let noteCard = $('#notes-list')
    let fullTask = $('#full-task')
    let createNoteCard = $('#create-note')
    let editTaskDiv = $('#edit-task')
    let deleteAllNotesCard = $('#delete-all-notes')
    
    fetchTaskById((taskid), (taskFound) => {
        fullTask.empty()
        noteCard.empty()
        createNoteCard.empty()
        editTaskDiv.empty()
        deleteAllNotesCard.empty()
        fullTask.append(getFullTask(taskFound))
    })
});


$(document).on('click', '#add-task', function(){ 
    if($('#task-title').val() == ''){
        $('#task-title').css({
            'border' : '1px solid red'
        })
        $('#req').css({
            'display' : 'block'
        })
    }
    else{
        var taskToCreate = {
            title: $('#task-title').val(),
            description: $('#description').val(),
            dueDate: $('#due-date').val(),
            status: $('#status').val(),
            priority: $('#priority').val()
        }
        createTask(taskToCreate)
    }   
});



$(document).on("click", "#btn-delete-task", (e) => {
    var taskid = $(e.target).attr('taskid')
    console.log(taskid)
    deleteTask(taskid)
    showTasks()
});



$(document).on("click", "#btn-edit-task", (e) => {
    var taskid = $(e.target).attr('taskid')
    $("#editTaskModal #taskid").val(taskid)

    fetchTaskById((taskid), (taskFound) => {
        $("#editTaskModal #due-date").val(taskFound.dueDate)
        $("#editTaskModal #priority").val(taskFound.priority)

        var status = taskFound.status
        if(status == 'Incomplete'){
            $('#editTaskModal #incompleteCheck').prop('checked', true)
            $('#editTaskModal #completeCheck').prop('checked', false)
        }
        else{
            $('#editTaskModal #incompleteCheck').prop('checked', false)
            $('#editTaskModal #completeCheck').prop('checked', true)
        }
    })
    var editTaskModal = $('#editTaskModal')  
    editTaskModal.modal({
        show: true
    })
});


$(document).on("click", "#edit-task-save-btn", () => {
    var taskid = $('#editTaskModal #taskid').val()
    var dueDate = $('#editTaskModal #due-date').val()
    var priority = $('#editTaskModal #priority').val()

    var checked = $('#editTaskModal #incompleteCheck').val()
    if($('#editTaskModal #completeCheck:checked').length >0)
        checked = $('#editTaskModal #completeCheck').val()
    
    editTask(taskid, dueDate, checked, priority)
});



$(document).on("click", "#delete-all-tasks-btn", () => {
    deleteAllTasks()
});

