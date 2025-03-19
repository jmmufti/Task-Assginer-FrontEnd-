document.addEventListener("DOMContentLoaded", function () {
    const activeTaskList = document.getElementById("active-task-list");
    const completedTaskList = document.getElementById("completed-task-list");
    const addTaskButton = document.querySelector(".add-task");
    const modal = document.getElementById("taskModal");
    const closeModal = document.querySelector(".close");
    const taskForm = document.getElementById("taskForm");
    const allActivitiesLink = document.getElementById("allActivities");
    const myActivitiesLink = document.getElementById("myActivities");
    const createdTasksLink = document.getElementById("createdTasks");
    const modalTitle = document.getElementById("modalTitle");
    const submitButton = document.getElementById("submitButton");
    const taskSidebar = document.getElementById("taskSidebar");

    // Retrieve user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));

    let currentUser = {};

    if (storedUser) {
        currentUser = {
            email: storedUser.email,
            role: storedUser.isAdmin ? "admin" : "user" // Set role based on isAdmin flag
        };
    } else {
        console.log("No user data found, redirecting to login...");
        window.location.href = "login.html"; // Redirect to login page if no user is found
    }

    // Array to store tasks fetched from the API
    let tasks = [];

    // Function to fetch tasks from the API
    async function fetchTasks() {
        try {
            const response = await fetch("https://task-assginer.onrender.com/api/tasks");
            if (!response.ok) {
                throw new Error("Failed to fetch tasks");
            }
            tasks = await response.json();
            renderTasks("all"); // Render all tasks initially
        } catch (error) {
            console.error("Error fetching tasks:", error);
            alert("Failed to fetch tasks. Please try again.");
        }
    }

    // Function to render tasks based on the filter
    function renderTasks(filter = "all") {
        activeTaskList.innerHTML = "";
        completedTaskList.innerHTML = "";

        let filteredTasks = [];

        if (filter === "all") {
            filteredTasks = tasks;
        } else if (filter === "my") {
            filteredTasks = tasks.filter(task => task.taskAssignedTo.includes(currentUser.email));
        } else if (filter === "created") {
            filteredTasks = tasks.filter(task => task.taskCreatedBy === currentUser.email);
        }

        const activeTasks = filteredTasks.filter(task => task.taskProgress !== "Completed");
        const completedTasks = filteredTasks.filter(task => task.taskProgress === "Completed");

        // Render active tasks
        activeTasks.forEach(task => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td onclick="showTaskDetails('${task._id}')">${task.taskName}</td>
                <td onclick="showTaskDetails('${task._id}')">${task.taskDescription}</td>
                <td onclick="showTaskDetails('${task._id}')">${task.taskCreatedBy}</td>
                <td onclick="showTaskDetails('${task._id}')">${task.taskAssignedTo.join(", ")}</td>
                <td onclick="showTaskDetails('${task._id}')">${task.taskProgress}</td>
                <td class="actions">
                    <button class="edit-btn" onclick="editTask('${task._id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteTask('${task._id}')">Delete</button>
                </td>
            `;
            activeTaskList.appendChild(row);
        });

        // Render completed tasks
        completedTasks.forEach(task => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td onclick="showTaskDetails('${task._id}')">${task.taskName}</td>
                <td onclick="showTaskDetails('${task._id}')">${task.taskDescription}</td>
                <td onclick="showTaskDetails('${task._id}')">${task.taskCreatedBy}</td>
                <td onclick="showTaskDetails('${task._id}')">${task.taskAssignedTo.join(", ")}</td>
                <td onclick="showTaskDetails('${task._id}')">${task.taskProgress}</td>
                <td class="actions">
                    <button class="edit-btn" onclick="editTask('${task._id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteTask('${task._id}')">Delete</button>
                </td>
            `;
            completedTaskList.appendChild(row);
        });

        // Update the task counts
        document.querySelector(".task-count").textContent = activeTasks.length;
        document.querySelector(".completed-task-count").textContent = completedTasks.length;
    }

    // Function to handle UI changes based on user role
    function handleUserRole() {
        const allActivitiesLink = document.getElementById("allActivities");

        if (currentUser.role === "admin") {
            allActivitiesLink.style.display = "block"; // Show for admin
            console.log("Admin access granted");
        } else {
            allActivitiesLink.style.display = "none"; // Hide for normal users
            console.log("User access granted");
        }
    }

    // Event listeners for navigation links
    allActivitiesLink.addEventListener("click", function () {
        allActivitiesLink.classList.add("active");
        myActivitiesLink.classList.remove("active");
        createdTasksLink.classList.remove("active");
        renderTasks("all");
    });

    myActivitiesLink.addEventListener("click", function () {
        myActivitiesLink.classList.add("active");
        allActivitiesLink.classList.remove("active");
        createdTasksLink.classList.remove("active");
        renderTasks("my");
    });

    createdTasksLink.addEventListener("click", function () {
        createdTasksLink.classList.add("active");
        allActivitiesLink.classList.remove("active");
        myActivitiesLink.classList.remove("active");
        renderTasks("created");
    });

    // Add task functionality
    addTaskButton.addEventListener("click", function () {
        modalTitle.textContent = "Create Task";
        submitButton.textContent = "Create Task";
        taskForm.reset();
        document.getElementById("taskCreatedByDisplay").textContent = `Created By: ${currentUser.email}`;
        modal.style.display = "block";
        currentTaskId = null; // Reset currentTaskId for new task creation
    });

    // Close modal functionality
    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    let currentTaskId = null;

    // Function to edit a task
    window.editTask = async function (taskId) {
        const task = tasks.find(task => task._id === taskId);
        if (task) {
            currentTaskId = taskId;
            modalTitle.textContent = "Edit Task";
            submitButton.textContent = "Update Task";
            document.getElementById("taskName").value = task.taskName;
            document.getElementById("taskDescription").value = task.taskDescription;
            document.getElementById("taskAssignedTo").value = task.taskAssignedTo.join(", ");
            document.getElementById("taskProgress").value = task.taskProgress;
            document.getElementById("taskCreatedByDisplay").textContent = `Created By: ${task.taskCreatedBy}`;
            modal.style.display = "block";
        }
    };

    // Function to delete a task
    window.deleteTask = async function (taskId) {
        if (confirm("Are you sure you want to delete this task?")) {
            try {
                const response = await fetch(`https://task-assginer.onrender.com/api/tasks/${taskId}`, {
                    method: "DELETE"
                });

                if (!response.ok) {
                    throw new Error("Failed to delete task");
                }

                const result = await response.json();
                if (result.message === "Task deleted successfully") {
                    tasks = tasks.filter(task => task._id !== taskId); // Remove the task from the local array
                    renderTasks(allActivitiesLink.classList.contains("active") ? "all" : "my");
                }
            } catch (error) {
                console.error("Error deleting task:", error);
                alert("Failed to delete task. Please try again.");
            }
        }
    };

    // Handle form submission (create or update task)
    taskForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const taskName = document.getElementById("taskName").value;
        const taskDescription = document.getElementById("taskDescription").value;
        const taskAssignedTo = document.getElementById("taskAssignedTo").value.split(",").map(email => email.trim());
        const taskProgress = document.getElementById("taskProgress").value;

        const taskData = {
            taskName,
            taskDescription,
            taskAssignedTo,
            taskProgress
        };

        try {
            let response;
            if (currentTaskId) {
                // Update existing task
                response = await fetch(`https://task-assginer.onrender.com/api/tasks/${currentTaskId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(taskData)
                });
            } else {
                // Create new task
                response = await fetch("https://task-assginer.onrender.com/api/tasks/addtask", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(taskData)
                });
            }

            if (!response.ok) {
                throw new Error("Failed to update task");
            }

            const updatedTask = await response.json();
            if (currentTaskId) {
                // Update the task in the local array
                const taskIndex = tasks.findIndex(task => task._id === currentTaskId);
                if (taskIndex !== -1) {
                    tasks[taskIndex] = updatedTask;
                }
            } else {
                // Add the new task to the local array
                tasks.push(updatedTask);
            }

            renderTasks(allActivitiesLink.classList.contains("active") ? "all" : "my");
            modal.style.display = "none";
            taskForm.reset();
            currentTaskId = null;
        } catch (error) {
            console.error("Error updating task:", error);
            alert("Failed to update task. Please try again.");
        }
    });

    // Profile dropdown functionality
    function toggleDropdown() {
        const dropdown = document.getElementById("dropdownMenu");
        dropdown.classList.toggle("show");
    }

    // Close the dropdown if the user clicks outside of it
    window.onclick = function (event) {
        if (!event.target.matches('.profile-icon')) {
            const dropdowns = document.getElementsByClassName("dropdown-content");
            for (let i = 0; i < dropdowns.length; i++) {
                const openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    };

    // Logout functionality
    function logout() {
        localStorage.removeItem("user"); // Remove user data from localStorage
        alert("Logging out...");
        window.location.href = "login.html"; // Redirect to login page
    }

    // Initial setup
    handleUserRole(); // Handle user role on page load
    fetchTasks(); // Fetch tasks from the API on page load
});