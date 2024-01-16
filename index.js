import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

// let taskData = [];
const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
let draggableTodo = null; 

let taskData = JSON.parse(localStorage.getItem('tasks')) || []

function dragStart() {
    draggableTodo = this;
    console.log('dragStart');
}

function dragEnd() {
    draggableTodo = null;
    console.log('dragEnd')
}

function dragOver(e) {
    e.preventDefault();
    console.log('dragOver')
}

function dragEnter() {
    console.log('dragEnter')
}

function dragLeave() {
    console.log('dragLeave')
}

function dragDrop() {
    this.appendChild(draggableTodo);
    console.log('dragDrop')
}



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
    localStorage.setItem('tasks', JSON.stringify(taskData))
}

function deleteTask(taskId) {
    var index1 = taskData.findIndex(function (task) {
        return task.uuid === taskId
    });
    taskData.splice(index1, 1)

    render()
    localStorage.setItem('tasks', JSON.stringify(taskData))
}


function completeTask(taskId) {
    const targetTaskObj = taskData.filter(function (task) {
        return task.uuid === taskId
    })[0]

    targetTaskObj.isComplete = !targetTaskObj.isComplete

    render()
    localStorage.setItem('tasks', JSON.stringify(taskData))
}

function updateTask(taskId, el) {
    var task = taskData.find((task) => task.uuid === taskId);
    if (el.classList.contains("task-comment-area")) {
        task.description = el.textContent
    } else {
        task.title = el.textContent
    }
    localStorage.setItem('tasks', JSON.stringify(taskData))
}


function getTaskListHtml() {
    let allStatus = ''
    let completeColour = ''

    if (taskData.length === 0) {
        allStatus += `
        <h2>Are you planning to chill today? if not, add some tasks :)</h2>
        `
    } else {
        // Render the todo tasks
        let todoTasks = taskData.filter((task) => {return task.isComplete === false})
        allStatus += `<h2 class='session-title'>To-do</h2><div class='status'>`
        for (let task of todoTasks) {
            allStatus += `
            <div id="${task.uuid}" class='task' draggable='true'>
                <button class="complete-btn" data-complete='${task.uuid}'></button>
                <span contenteditable class='text-task' data-update='${task.uuid}'>${task.title}</span>
                <span contenteditable class='task-comment-area' data-update='${task.uuid}'>${task.description}</span>
                <button class='close-btn' data-delete='${task.uuid}'>x</button>
            </div>
            `
        }
        allStatus += `</div>`

        let inprogressTasks = taskData.filter((task) => {return task.isComplete === true})
        allStatus += `<h2 class='session-title'>In-Progress</h2><div class='status'>`
        for (let task of inprogressTasks) {
            allStatus += `
            <div id="${task.uuid}" class='task' draggable='true'>
                <button class="complete-btn" data-complete='${task.uuid}' style='background-color:${completeColour}'></button>
                <span contenteditable class='text-task' data-update='${task.uuid}'>${task.title}</span>
                <span contenteditable class='task-comment-area' data-update='${task.uuid}'>${task.description}</span>
                <button class='close-btn' data-delete='${task.uuid}'>x</button>
            </div>
            `
        }
        allStatus += `</div>`
    
        // Render the done tasks
        let doneTasks = taskData.filter((task) => {return task.isComplete === true})
        allStatus += `<h2 class='session-title'>Done</h2><div class='status'>`
        for (let task of doneTasks) {
            completeColour = "pink"
            allStatus += `
            <div id="${task.uuid}" class='task' draggable='true'>
                <button class="complete-btn" data-complete='${task.uuid}' style='background-color:${completeColour}'></button>
                <span contenteditable class='text-task' data-update='${task.uuid}'>${task.title}</span>
                <span contenteditable class='task-comment-area' data-update='${task.uuid}'>${task.description}</span>
                <button class='close-btn' data-delete='${task.uuid}'>x</button>
            </div>
            `
        }
        allStatus += `</div>`
    }
    return allStatus
}

function addEventDragAndDropListeners() {
    let todos = document.querySelectorAll('.task');
    let statusArea = document.querySelectorAll('.status');
    console.log(todos)
    console.log(statusArea)
    todos.forEach((todo) => {
        todo.addEventListener('dragstart', dragStart);
        todo.addEventListener('dragend', dragEnd);
    })
    statusArea.forEach((status) => {
        console.log(status)
        status.addEventListener('dragover', dragOver);
        status.addEventListener('dragenter', dragEnter);
        status.addEventListener('dragleave', dragLeave);
        status.addEventListener('drop', dragDrop);
    })
}

function render() {
    document.getElementById('todo-container').innerHTML = getTaskListHtml()
    addEventDragAndDropListeners()
}

render()