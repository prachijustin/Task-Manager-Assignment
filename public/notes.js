const fetchNotes = (id, done) =>{
    $.get(`/tasks/${id}/notes`, (data) => {
        done(data)
    }).catch((obj) => {
        alert('No notes found.')
        console.log(obj.status)
    })
}

const createNoteAPI = (id, noteToCreate) =>{
    $.post(`/tasks/${id}/notes`, noteToCreate, () => {
        successMessage('Note added successfully!!')
    })
    return true
}

const taskNotes = (e) => {
    var taskid = $(e.target).attr('taskid')
    let fullTask = $('#full-task')
    let noteCard = $('#notes-list')
    let createNoteCard = $('#create-note')

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
    createNoteCard.append(createNote(taskid))
}

const getNotes = (note) => {
    return $(`
    <div class="col-4">
        <div class="card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">NOTE ${note.noteID}</h5>
                <p class="card-text">${note.noteDescription}</p>
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

