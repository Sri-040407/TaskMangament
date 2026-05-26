const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const pendingTasksContainer = document.getElementById("pending-tasks");
const completedTasksContainer = document.getElementById("completed-tasks");
const pendingCountLabel = document.getElementById("pending-count");
const completedCountLabel = document.getElementById("completed-count");

let tasks = [];

function createTaskElement(task) {
    const card = document.createElement("article");
    card.className = "task-card";
    if (task.completed) card.classList.add("completed");
    card.dataset.id = task.id;

    const text = document.createElement("p");
    text.className = "task-text";
    text.textContent = task.text;
    card.appendChild(text);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const completeButton = document.createElement("button");
    completeButton.className = "button-pill complete-btn";
    completeButton.textContent = task.completed ? "Mark Pending" : "Mark Complete";
    completeButton.addEventListener("click", () => toggleCompletion(task.id));
    actions.appendChild(completeButton);

    const editButton = document.createElement("button");
    editButton.className = "button-pill edit-btn";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => editTask(task.id));
    actions.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.className = "button-pill delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteTask(task.id));
    actions.appendChild(deleteButton);

    card.appendChild(actions);
    return card;
}

function renderTasks() {
    pendingTasksContainer.innerHTML = "";
    completedTasksContainer.innerHTML = "";

    const pendingTasks = tasks.filter((task) => !task.completed);
    const completedTasks = tasks.filter((task) => task.completed);

    pendingTasks.forEach((task) => {
        const element = createTaskElement(task);
        pendingTasksContainer.appendChild(element);
    });

    completedTasks.forEach((task) => {
        const element = createTaskElement(task);
        completedTasksContainer.appendChild(element);
    });

    pendingCountLabel.textContent = pendingTasks.length;
    completedCountLabel.textContent = completedTasks.length;
}

function addTask() {
    const textValue = taskInput.value.trim();
    if (!textValue) return;

    const newTask = {
        id: Date.now().toString(),
        text: textValue,
        completed: false,
    };

    tasks.unshift(newTask);
    taskInput.value = "";
    renderTasks();
    taskInput.focus();
}

function toggleCompletion(id) {
    tasks = tasks.map((task) => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    renderTasks();
}

function editTask(id) {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    const card = document.querySelector(`[data-id="${id}"]`);
    if (!card) return;

    const taskText = card.querySelector(".task-text");
    const actions = card.querySelector(".task-actions");
    const editInput = document.createElement("input");

    editInput.type = "text";
    editInput.className = "task-edit-input";
    editInput.value = task.text;
    editInput.placeholder = "Update task...";

    taskText.replaceWith(editInput);
    actions.innerHTML = "";

    const saveButton = document.createElement("button");
    saveButton.className = "button-pill save-btn";
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", saveEdit);

    const cancelButton = document.createElement("button");
    cancelButton.className = "button-pill cancel-btn";
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", cancelEdit);

    actions.appendChild(saveButton);
    actions.appendChild(cancelButton);
    editInput.focus();

    editInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            saveEdit();
        }
        if (event.key === "Escape") {
            cancelEdit();
        }
    });

    function saveEdit() {
        const trimmedText = editInput.value.trim();
        if (!trimmedText) return;

        tasks = tasks.map((item) => {
            if (item.id === id) {
                return { ...item, text: trimmedText };
            }
            return item;
        });
        renderTasks();
    }

    function cancelEdit() {
        renderTasks();
    }
}

function deleteTask(id) {
    const shouldDelete = confirm("Delete this task? This cannot be undone.");
    if (!shouldDelete) return;

    tasks = tasks.filter((task) => task.id !== id);
    renderTasks();
}

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

renderTasks();
