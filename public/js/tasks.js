/*
    -----------Methods to call APIs-------------
*/

// Method for GET /tasks API
const fetchTasks = (done) =>{
    $.get('/tasks', (data) => {
        done(data)
    })
}


// Method for POST /tasks API
const createTask = (taskToCreate) =>{
    $.post('/tasks', taskToCreate, () => {
        $('#addTaskModal').modal('toggle')
        successMessage('Task created successfully!!')
        $('#addTaskModal').find("input,textarea").val('')

        $('#task-title-box').css({
            'border' : '1px solid #ced4da'
        })
        $('#req').css({
            'display' : 'none'
        })

        var tomorrow = new Date();
        tomorrow.setDate(new Date().getDate()+1);

        var finalDate = tomorrow.toISOString().split('T')[0]
        $('#addTaskModal #due-date').val(finalDate);

        $('#addTaskModal #incompleteCheck').prop('checked', true)
        showTasks()
    })
}


// Method for Get /tasks/:id API
const fetchTaskById = (taskid, done) => {
    $.get(`/tasks/${taskid}`, (task) => {
        done(task)
        let taskTitleUI = $('#task-title')
        taskTitleUI.empty()
    })
}


// Method for DELETE /tasks/:id API
const deleteTask = (taskid) => {
    $.ajax({
        url: `/tasks/${taskid}`,
        type: 'DELETE',
        success: () =>{
            alert('Task deleted successfully.')
            let fullTask = $('#full-task')
            fullTask.empty()
            let taskTitleUI = $('#task-title')
            taskTitleUI.empty()
            showTasks()
        }
    });
}


// Method for PATCH /tasks/:id API
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
            showTasks()
            let fullTask = $('#full-task')
            fullTask.empty()
            let taskTitleUI = $('#task-title')
            taskTitleUI.empty()
            fetchTaskById((taskid), (taskFound) => {
                fullTask.append(getFullTask(taskFound))
            })
        }
    });
}


// Method for DELETE /tasks API
const deleteAllTasks = () => {
    $.ajax({
        url: '/tasks',
        type: 'DELETE',
        success: () =>{
            alert('All tasks deleted successfully.')
            showTasks()
            let taskTitleUI = $('#task-title')
            taskTitleUI.empty()
        }
    });
}



/*
    ----------- Methods to return response coming from APIs to frontend-------------
*/

// Method for retrieving all tasks to frontend as a list of tasks
const getTaskDetails = (task) =>{
    return $(`
        <a href="#" class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1" style="font-family: cursive; font-weight: 600; font-size: 20px;">${task.title}</h5>
            <small>Due Date: ${task.dueDate}</small>
        </div>
        <button type="button" class="btn btn-success" taskid="${task.taskID}" tasktitle="${task.title}" id="task-notes" style="margin: 5px;">Notes</button>
        <button type="button" class="btn btn-light" taskid="${task.taskID}" id="task-details" style="margin: 5px;">More</button>       
        <p class="mb-1" style="font-size: smaller;">Priority: <b> ${task.priority} </b></p>
        <p class="mb-1" style="font-size: smaller;">Status: <b> ${task.status} </b></p>
        </a>`)
}


// Method to get all the details of a specific task
const getFullTask = (task) => {
    return $(`
    <div class="card">
        <div class="card-header">
        <h3><b>TASK:</b> <span style="font-family: cursive;"> ${task.taskID} </span></h3>
            <br>
            <h3><b>TASK:</b> <span style="font-family: cursive;"> ${task.title} </span></h3>
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


// Method to edit the task
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



/*
    ----------- Methods handling button clicks-------------
*/

// Button click to retrieve all notes of specific task
$(document).on("click", "#task-notes", (e) => {
    taskNotes(e)
});


// Button click to get task details
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


// Button click to add a new task
$(document).on('click', '#add-task', function(){ 
    $('#addTaskModal #incompleteCheck').prop('checked', true)
    if($('#task-title-box').val() == ''){
        $('#task-title-box').css({
            'border' : '1px solid red'
        })
        $('#req').css({
            'display' : 'block'
        })
    }
    else{     
        var checked = ''
        if($('#addTaskModal #completeCheck:checked').length >0)
            checked = $('#addTaskModal #completeCheck').val()
        else
            checked = $('#addTaskModal #incompleteCheck').val()

        if(checked == 'Incomplete'){
            $('#addTaskModal #incompleteCheck').prop('checked', true)
            $('#addTaskModal #completeCheck').prop('checked', false)
        }
        else{
            $('#addTaskModal #incompleteCheck').prop('checked', false)
            $('#addTaskModal #completeCheck').prop('checked', true)
        }
    
        var taskToCreate = {
            title: $('#task-title-box').val(),
            description: $('#description').val(),
            dueDate: $('#due-date').val(),
            status: checked,
            priority: $('#priority').val()
        }
        createTask(taskToCreate)
    }   
});


// Button click to delete a task
$(document).on("click", "#btn-delete-task", (e) => {
    var taskid = $(e.target).attr('taskid')
    console.log(taskid)
    deleteTask(taskid)
    showTasks()
});


// Button click to edit a task (GET)
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


// Button click to edit a task (POST)
$(document).on("click", "#edit-task-save-btn", () => {
    var taskid = $('#editTaskModal #taskid').val()
    var dueDate = $('#editTaskModal #due-date').val()
    var priority = $('#editTaskModal #priority').val()

    var checked = $('#editTaskModal #incompleteCheck').val()
    if($('#editTaskModal #completeCheck:checked').length >0)
        checked = $('#editTaskModal #completeCheck').val()
    
    editTask(taskid, dueDate, checked, priority)
});


// Button click to delete all tasks
$(document).on("click", "#delete-all-tasks-btn", () => {
    deleteAllTasks()
});



/*
    ----------- Methods for handling sorting-------------
    Sorting tasks by DueDate, Priority and Status
*/

// -----Handling sort by DueDate--------------
const compareDueDate = (task1, task2) => {
    if (task1.dueDate < task2.dueDate) return -1
    if (task1.dueDate > task2.dueDate) return 1
    return 0
}
  
$(document).on("click", "#sort-date-btn", () => {
    let taskList = $('#task-list')
    fetchTasks((tasks) => {
        tasks.sort(compareDueDate)
        taskList.empty()
        for(task of tasks){
            taskList.append(getTaskDetails(task))
        }
    })
});
//----------------------------------------


// -----Handling sort by Priority--------------
const comparePriority = (task1, task2) => {
    var priorityOrder = {'High': 1, 'Medium': 2, 'Low': 3}
    return (priorityOrder[task1.priority] - priorityOrder[task2.priority])
}

$(document).on("click", "#sort-priority-btn", () => {
    let taskList = $('#task-list')
    fetchTasks((tasks) => {
        tasks.sort(comparePriority)
        taskList.empty()
        for(task of tasks){
            taskList.append(getTaskDetails(task))
        }
    })
});
//----------------------------------------


// -----Handling sort by Status--------------
const compareStatus = (task1, task2) => {
    var statusOrder = {'Incomplete': 1, 'Complete': 2}
    return (statusOrder[task1.status] - statusOrder[task2.status])
}

$(document).on("click", "#sort-status-btn", () => {
    let taskList = $('#task-list')
    fetchTasks((tasks) => {       
        tasks.sort(compareStatus)      
        taskList.empty()
        for(task of tasks){
            console.log(task.status)
            taskList.append(getTaskDetails(task))
        }
    })
});
//----------------------------------------


// ----------Default ---------------------
$(document).on("click", "#all-btn", () => {
    let taskList = $('#task-list')
    fetchTasks((tasks) => {
        taskList.empty()
        for(task of tasks){
            taskList.append(getTaskDetails(task))
        }
    })
})
//---------------------------------------