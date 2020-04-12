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
    // var tomorrow = new Date().setDate(new Date().getDate()+1)
    // var finalDate = today().getTime() + 24 * 60 * 60 * 1000;
    // $('#due-date').val(finalDate);

})
