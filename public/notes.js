const fetchNotes = (id, done) =>{
    $.get(`/tasks/${id}/notes`, (data) => {
        done(data)
    })
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


const createNote = () => {
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
        <button type="button" id="note-btn" class="btn btn-success">ADD NOTE</button>
    </div>`)
}


$(document).on('click', '#note-btn', function(){ 
    var noteToCreate = {
        title: $('#task-title').val(),
        description: $('#description').val(),
        dueDate: $('#due-date').val(),
        status: $('#status').val(),
        priority: $('#priority').val()
    }
    createTask(taskToCreate)
});

