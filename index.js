import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let taskData = [];
const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');


document.addEventListener('input', (e) => {
    if (e.target.dataset.update) {
        const taskId = e.target.closest('div').id
        updateTask(taskId, e.target)
    }
})


todoForm.addEventListener('submit', (e) => {
    e.preventDefault()
    addTask()
})

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
    if (taskInput.value) {
        taskData.unshift({
            title: taskInput.value,
            description: 'Add description',
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

    render()
}


function completeTask(taskId) {
    const targetTaskObj = taskData.filter(function (task) {
        return task.uuid === taskId
    })[0]

    targetTaskObj.isComplete = !targetTaskObj.isComplete

    render()
}

function updateTask(taskId, el) {
    var task = taskData.find((task) => task.uuid === taskId);
    if (el.classList.contains("task-comment-area")) {
        task.description = el.textContent
    } else {
        task.title = el.textContent
    }
}


function getTaskListHtml() {
    let html = ''
    let completeColour = ''

    if (taskData.length === 0) {
        html += `
        <h2>Are you planning to chill today? if not, add some tasks :)</h2>
        `
    } else {
        // Render the todo tasks
        let todoTasks = taskData.filter((task) => {return task.isComplete === false})
        html += `<h2 class='session-title'>To-do</h2>`
        for (let task of todoTasks) {
            html += `
            <div id="${task.uuid}" class='task'>
                <button class="complete-btn" data-complete='${task.uuid}'></button>
                <span contenteditable class='text-task' data-update='${task.uuid}'>${task.title}</span>
                <span contenteditable class='task-comment-area' data-update='${task.uuid}'>${task.description}</span>
                <button class='close-btn' data-delete='${task.uuid}'>x</button>
            </div>
            `
        }
    
        // Render the done tasks
        let doneTasks = taskData.filter((task) => {return task.isComplete === true})
        html += `<h2 class='session-title'>Done</h2>`
        for (let task of doneTasks) {
            completeColour = "pink"
            html += `
            <div id="${task.uuid}" class='task'>
                <button class="complete-btn" data-complete='${task.uuid}' style='background-color:${completeColour}'></button>
                <span contenteditable class='text-task' data-update='${task.uuid}'>${task.title}</span>
                <span contenteditable class='task-comment-area' data-update='${task.uuid}'>${task.description}</span>
                <button class='close-btn' data-delete='${task.uuid}'>x</button>
            </div>
            `
        }
    }
    return html
}


function render() {
    document.getElementById('task-list').innerHTML = getTaskListHtml()
}

render()