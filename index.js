import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let taskData = [];

document.addEventListener("click", stateHandle);


function stateHandle(e) {
    if(e.target.id === 'add-task-btn'){
        addTask()
    } else if (e.target.dataset.delete) {
        deleteTask(e.target.dataset.delete)
    } else if (e.target.dataset.complete) {
        completeTask(e.target.dataset.complete)
    }
}


function addTask() {
    const taskInput = document.getElementById('task-input')

    if (taskInput.value) {
        taskData.unshift({
            title: taskInput.value,
            isComplete: false,
            uuid: uuidv4()
        })
        render()
        taskInput.value = ''
    }
}

function deleteTask(taskId){
    var index = taskData.findIndex(function(task) {
        return task.uuid === taskId
      });
    taskData.splice(index, 1)
    render()
}


function completeTask(taskId){ 
    const targetTaskObj = taskData.filter(function(task){
        return task.uuid === taskId
    })[0]

    targetTaskObj.isComplete = !targetTaskObj.isComplete
    render()
}


function getTaskListHtml() {
  let html = ''
        
        if(taskData.length === 0){
            html += `
            <h2>Are you planning to chill today? if not, add some tasks :)</h2>
            `
        } else {
            for (let task of taskData) {

                let completeColour = ''
                if (task.isComplete){
                    completeColour = "pink"
                }
            
                html += `
                <div id="${task.uuid}" class='task'>
                <button class="complete-btn" data-complete='${task.uuid}' style='background-color:${completeColour}'></button>
                  <li class='text-task'>${task.title}</li>
                  <button class='close-btn' data-delete='${task.uuid}'>x</button>
                </div>
                `
              }
        }
  return html
}


function render(){
    document.getElementById('task-list').innerHTML = getTaskListHtml()
}

render()