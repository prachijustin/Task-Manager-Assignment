const fetchNotes = (id, done) =>{
    $.get(`/tasks/${id}/notes`, (data) => {
        done(data)
    }).catch((obj) => {
        alert('No notes found.')
        let deleteAllNotesCard = $('#delete-all-notes')
        deleteAllNotesCard.empty()
        console.log(obj.status)
    })
}

const createNoteAPI = (id, noteToCreate) =>{
    $.post(`/tasks/${id}/notes`, noteToCreate, () => {
        successMessage('Note added successfully!!')
    })
    return true
}


const notesUtil = (taskid) => {
    let fullTask = $('#full-task')
    let noteCard = $('#notes-list')
    let createNoteCard = $('#create-note')
    let deleteAllNotesCard = $('#delete-all-notes')

    fetchNotes((taskid), (notesFound) => {
        noteCard.empty()
        fullTask.empty()   
        
        for(note of notesFound){
            noteCard.append(getNotes(note))
        }       
    })
    noteCard.empty()
    fullTask.empty()
    createNoteCard.empty()
    deleteAllNotesCard.empty()

    
    deleteAllNotesCard.append(deleteAllNotes(taskid))
    //deleteAllNotesCard.append(deleteAllNotes())
    createNoteCard.append(createNote(taskid))
}


const taskNotes = (e) => {
    var taskid = $(e.target).attr('taskid')
    notesUtil(taskid)
}


const deleteNote = (taskid, noteid) => {
    $.ajax({
        url: `/tasks/${taskid}/notes/${noteid}`,
        type: 'DELETE',
        success: () =>{
            alert('Note deleted successfully.')
            notesUtil(taskid)
        }
    });
}

const editNote = (taskid, noteid, desc) => {
    $.ajax({
        url: `/tasks/${taskid}/notes/${noteid}`,
        type: 'PATCH',
        data: {
            noteDescription: desc
        },
        success: () =>{
            alert('Note updated successfully.')
            $('#editNoteModal').modal('toggle')
            notesUtil(taskid)
        }
    });
}


const deleteAllNotesAPI = (taskid) => {
    $.ajax({
        url: `/tasks/${taskid}/notes`,
        type: 'DELETE',
        success: () =>{
            alert('All Notes deleted successfully.')
            notesUtil(taskid)
        }
    });
}


const deleteAllNotes = (taskid) =>{
    return (`
    <button type="button" taskid="${taskid}" id="btn-delete-all-notes" class="btn btn-outline-danger my-2 my-sm-0">Delete All Notes</button>
    `)
}


const getNotes = (note) => {
    return $(`
    <div class="col-4">  
        <div class="card" style="width: 18rem;">       
            <div class="card-body">               
                <h5 class="card-title">NOTE ${note.noteID}</h5>
                <p class="card-text">${note.noteDescription}</p>
                <button type="button" id="btn-delete-note" taskid="${note.TaskTaskID}" noteid="${note.noteID}" class="btn btn-danger" style="margin:5px;">Delete</button>
                <button type="button" id="btn-edit-note" desc="${note.noteDescription}" taskid="${note.TaskTaskID}" noteid="${note.noteID}" class="btn btn-warning" style="margin:5px;">Edit</button>
                </div>
        </div>
    </div>
    `)
}


const createNote = (taskid) => {
    return $(`
    <div class="note-div">
        <h4> CREATE NOTE</h4>
        <br>
        <div class="form-row">
            <div class="form-group">
                <label for="desc">* Note Description: </label>
                <textarea class="form-control" class="form-control" rows="4" cols="200" id="desc" style="width:500px;" required></textarea>
            </div>         
        </div>
        <button type="button" id="note-btn" taskid="${taskid}" class="btn btn-success">ADD NOTE</button>
    </div>`)
}


$(document).on('click', '#note-btn', (e) => { 
    var taskid = $(e.target).attr('taskid')
    var noteToCreate = {
        noteDescription: $('#desc').val(),
        TaskTaskID: taskid
    }
    if(createNoteAPI(taskid, noteToCreate)){
        taskNotes(e)
    }
});



$(document).on('click', '#btn-delete-note', (e) => { 
    var taskid = $(e.target).attr('taskid')
    var noteid = $(e.target).attr('noteid')
    deleteNote(taskid, noteid)
});


$(document).on('click', '#btn-edit-note', (e) => { 
    var taskid = $(e.target).attr('taskid')
    var noteid = $(e.target).attr('noteid')
    var desc = $(e.target).attr('desc')

    var editNoteModal = $('#editNoteModal')
    $("#editNoteModal #desc").val(desc);
    $("#editNoteModal #noteid").val(noteid);
    $("#editNoteModal #taskid").val(taskid);
    editNoteModal.modal({
        show: true
    })
});


$(document).on('click', '#edit-note-save', () => { 
    var noteid = $('#noteid').val()
    var taskid = $('#taskid').val()
    var description = $('#editNoteModal #desc').val()

    //console.log(description)
    editNote(taskid, noteid, description)
});


$(document).on('click', '#btn-delete-all-notes', (e) => { 
    var taskid = $(e.target).attr('taskid')
    deleteAllNotesAPI(taskid)
});
