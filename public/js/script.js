// Fetching all tasks and showing when site loads
const showTasks = () => {
    let taskList = $('#task-list')
    fetchTasks((tasks) => {
        taskList.empty()
        for(task of tasks){
            taskList.append(getTaskDetails(task))
        }
    })
}


// Method called by default when site loads
$(() => {
    showTasks()
    var tomorrow = new Date();
    tomorrow.setDate(new Date().getDate()+1);

    var finalDate = tomorrow.toISOString().split('T')[0]
    $('#addTaskModal #due-date').val(finalDate);

    $('.form-check-input').on('change', function() {
        $('.form-check-input').not(this).prop('checked', false);  
    });

    $('#addTaskModal #incompleteCheck').prop('checked', true)
})


// Utiltity function
const successMessage = (message) => {
    alert(message)
}