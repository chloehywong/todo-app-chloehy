import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let taskData = [];
let taskDoneData = [];

document.addEventListener("click", stateHandle);


function stateHandle(e) {
    if (e.target.id === 'add-task-btn') {
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

function deleteTask(taskId) {
    var index1 = taskData.findIndex(function (task) {
        return task.uuid === taskId
    });
    taskData.splice(index1, 1)
     
    var index2 = taskDoneData.findIndex(function (task) {
        return task.uuid === taskId
    });
    taskDoneData.splice(index2, 1)

    render()
}


function completeTask(taskId) {
    const targetTaskObj = taskData.filter(function (task) {
        return task.uuid === taskId
    })[0]

    targetTaskObj.isComplete = !targetTaskObj.isComplete

    taskDoneData.push(targetTaskObj)
    render()
}


function getTodoTaskListHtml() {
    let todoHtml = ''

    if (taskData.length === 0 && taskDoneData.length === 0) {
        todoHtml += `
            <h2>Are you planning to chill today? if not, add some tasks :)</h2>
            `
    } else {
        todoHtml = `<h2 class='session-title'>To-do</h2>`
        for (let task of taskData) {
            if (!task.isComplete) {
                todoHtml += `
                    <div id="${task.uuid}" class='task'>
                        <button class="complete-btn" data-complete='${task.uuid}'></button>
                        <li class='text-task'>${task.title}</li>
                        <textarea class='task-comment-area' placeholder='Description/Comment...'></textarea>
                        <button class='close-btn' data-delete='${task.uuid}'>x</button>
                    </div>
                    `
            }

        }
    }
    console.log(taskData)
    return todoHtml
}


function getCompleteTaskListHtml() {
    let doneHtml = ''
    if (taskDoneData.length > 0) {
        doneHtml = `<h2 class='session-title'>Done</h2>`
        for (let done of taskDoneData) {
            let completeColour = ''
            if (done.isComplete) {
                completeColour = "pink"
            }
            doneHtml += `
            <div id="${done.uuid}" class='task'>
                <button class="complete-btn" data-complete='${done.uuid}' style='background-color:${completeColour}'></button>
                <li class='text-task'>${done.title}</li>
                <textarea class='task-comment-area' placeholder='Description/Comment...'></textarea>
                <button class='close-btn' data-delete='${done.uuid}'>x</button>
            </div>
            `
        }
    }
    console.log(taskDoneData)
    return doneHtml
}


function render() {
    document.getElementById('task-list-todo').innerHTML = getTodoTaskListHtml()
    document.getElementById('task-list-done').innerHTML = getCompleteTaskListHtml()
}

render()