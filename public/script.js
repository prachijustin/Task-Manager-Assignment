const showTasks = () => {
    let taskList = $('#task-list')
    fetchTasks((tasks) => {
        taskList.empty()
        for(task of tasks){
            taskList.append(getTaskDetails(task))
        }
    })
}

$(() => {
    showTasks()
    var tomorrow = new Date();
    tomorrow.setDate(new Date().getDate()+1);

    var finalDate = tomorrow.toISOString().split('T')[0]
    $('#addTaskModal #due-date').val(finalDate);

    $('.form-check-input').on('change', function() {
        $('.form-check-input').not(this).prop('checked', false);  
    });
})
