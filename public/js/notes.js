/*
    -----------Utiltiy Methods for Notes-------------
*/
const notesUtil = (taskid, tasktitle) => {
    let fullTask = $('#full-task')
    let noteCard = $('#notes-list')
    let createNoteCard = $('#create-note')
    let deleteAllNotesCard = $('#delete-all-notes')
    let taskTitleUI = $('#task-title')

    taskTitleUI.empty()
    taskTitleUI.append(taskTitle(tasktitle))

    fetchNotes((taskid), (notesFound) => {
        noteCard.empty()
        fullTask.empty()  
        
        for(note of notesFound){
            noteCard.append(getNotes(note, tasktitle))         
        }    
    })
    noteCard.empty()
    fullTask.empty()
    createNoteCard.empty()
    deleteAllNotesCard.empty()  
    taskTitleUI.empty()
    taskTitleUI.append(taskTitle(tasktitle)) 
    createNoteCard.append(createNote(taskid, tasktitle))
    deleteAllNotesCard.append(deleteAllNotes(taskid, tasktitle))
}

const taskNotes = (e) => {
    var taskid = $(e.target).attr('taskid')
    var tasktitle = $(e.target).attr('tasktitle')
    notesUtil(taskid, tasktitle)
}



/*
    -----------Methods to call APIs-------------
*/

// Method for GET /tasks/:id/notes API
const fetchNotes = (id, done) =>{
    $.get(`/tasks/${id}/notes`, (data) => {
        done(data)
    }).catch((obj) => {
        alert('No notes found.')
        let noteCard = $('#notes-list')
        noteCard.empty()
        let deleteAllNotesCard = $('#delete-all-notes')
        deleteAllNotesCard.empty()
        console.log(obj.status)
    })
}


// Method for POST /tasks/:id/notes API
const createNoteAPI = (id, noteToCreate) =>{
    $.post(`/tasks/${id}/notes`, noteToCreate, () => {
        successMessage('Note added successfully!!')
    })
    return true
}


// Method for DELETE /tasks/:taskid/notes/:noteid API
const deleteNote = (taskid, noteid, tasktitle) => {
    $.ajax({
        url: `/tasks/${taskid}/notes/${noteid}`,
        type: 'DELETE',
        success: () =>{
            alert('Note deleted successfully.')
            notesUtil(taskid, tasktitle)
        }
    });
}


// Method for PATCH /tasks/:taskid/notes/:noteid API
const editNote = (taskid, noteid, desc, tasktitle) => {
    $.ajax({
        url: `/tasks/${taskid}/notes/${noteid}`,
        type: 'PATCH',
        data: {
            noteDescription: desc
        },
        success: () =>{
            alert('Note updated successfully.')
            $('#editNoteModal').modal('toggle')
            notesUtil(taskid, tasktitle)
        }
    });
}


// Method for DELETE /tasks/:id/notes API
const deleteAllNotesAPI = (taskid, tasktitle) => {
    $.ajax({
        url: `/tasks/${taskid}/notes`,
        type: 'DELETE',
        success: () =>{
            alert('All Notes deleted successfully.')
            notesUtil(taskid, tasktitle)
        }
    });
}



/*
    ----------- Methods to return response coming from APIs to frontend-------------
*/

// Method to show task title
const taskTitle = (tasktitle) => {
    return $(`            
    <h3><b>TASK:</b> <span style="font-family: cursive;"> ${tasktitle} </span></h3>
    <br><br>
    `)
}


// Method to retrieve all notes of specific task
const getNotes = (note, tasktitle) => {
    return $(`
    <div class="col-4">  
        <div class="card" style="width: 18rem;">       
            <div class="card-body">               
                <h5 class="card-title">NOTE ${note.noteID}</h5>
                <p class="card-text">${note.noteDescription}</p>
                <button type="button" id="btn-delete-note" tasktitle="${tasktitle}" taskid="${note.TaskTaskID}" noteid="${note.noteID}" class="btn btn-danger" style="margin:5px;">Delete</button>
                <button type="button" id="btn-edit-note" tasktitle="${tasktitle}" desc="${note.noteDescription}" taskid="${note.TaskTaskID}" noteid="${note.noteID}" class="btn btn-warning" style="margin:5px;">Edit</button>
                </div>
        </div>
    </div>
    `)
}

// Method to create note for specific task
const createNote = (taskid, tasktitle) => {
    return $(`
    <div class="note-div">
        <h4> CREATE NOTE</h4>
        <br>
        <div class="form-row">
            <div class="form-group">
                <label for="desc">* Note Description: </label>
                <textarea class="form-control" class="form-control" rows="4" cols="200" id="desc" style="width:500px;" required></textarea>
                <p id="req" style="color: red; display:none; font-size: 12px;">Description is required</p>
            </div>         
        </div>
        <button type="button" id="note-btn" tasktitle="${tasktitle}"  taskid="${taskid}" class="btn btn-success">ADD NOTE</button>
    </div>`)
}


// Method to delete all notes
const deleteAllNotes = (taskid, tasktitle) =>{
    let noteCard = $('#notes-list')
    noteCard.empty()
    return (`
    <button type="button" tasktitle="${tasktitle}" taskid="${taskid}" id="btn-delete-all-notes" class="btn btn-outline-danger my-2 my-sm-0">Delete All Notes</button>
    `)
}



/*
    ----------- Methods handling button clicks-------------
*/

// Button click to create a note
$(document).on('click', '#note-btn', (e) => { 
    var taskid = $(e.target).attr('taskid')
    if($('#desc').val() == ''){
        $('#desc').css({
            'border' : '1px solid red'
        })
        $('#req').css({
            'display' : 'block'
        })
    }
    else{
        var noteToCreate = {
            noteDescription: $('#desc').val(),
            TaskTaskID: taskid
        }       
        if(createNoteAPI(taskid, noteToCreate)){
            taskNotes(e)
        }
    }  
});


// Button click to delete a specific note
$(document).on('click', '#btn-delete-note', (e) => { 
    var taskid = $(e.target).attr('taskid')
    var noteid = $(e.target).attr('noteid')
    var tasktitle = $(e.target).attr('tasktitle')
    deleteNote(taskid, noteid, tasktitle)
});


// Button click to edit a note(GET)
$(document).on('click', '#btn-edit-note', (e) => { 
    var taskid = $(e.target).attr('taskid')
    var noteid = $(e.target).attr('noteid')
    var desc = $(e.target).attr('desc')
    var tasktitle = $(e.target).attr('tasktitle')
    var editNoteModal = $('#editNoteModal')
    $("#editNoteModal #desc").val(desc);
    $("#editNoteModal #noteid").val(noteid);
    $("#editNoteModal #taskid").val(taskid);
    $("#editNoteModal #tasktitle").val(tasktitle);
    editNoteModal.modal({
        show: true
    })
});


// Button click to edit a note(POST)
$(document).on('click', '#edit-note-save', () => { 
    var noteid = $('#editNoteModal #noteid').val()
    var taskid = $('#editNoteModal #taskid').val()
    var description = $('#editNoteModal #desc').val()
    var tasktitle = $('#editNoteModal #tasktitle').val()
    editNote(taskid, noteid, description, tasktitle)
});


// Button click to delete all notes
$(document).on('click', '#btn-delete-all-notes', (e) => { 
    var taskid = $(e.target).attr('taskid')
    var tasktitle = $(e.target).attr('tasktitle')
    deleteAllNotesAPI(taskid, tasktitle)
});
