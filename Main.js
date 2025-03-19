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

    // Simulate the logged-in user (replace with actual logged-in user data)
    let currentUser = {
        email: "user@example.com",
        role: "admin" // Can be "admin" or "user"
    };

    // Example tasks (replace with data fetched from the backend)
    let tasks = [
        {
            id: 1,
            taskName: "Watch a 2-min video",
            taskDescription: "Watch a tutorial video",
            taskCreatedBy: currentUser.email,
            taskAssignedTo: ["user2@example.com"],
            taskProgress: "Unassigned",
        },
        {
            id: 2,
            taskName: "Download Bordio’s mobile app",
            taskDescription: "Download and install the app",
            taskCreatedBy: currentUser.email,
            taskAssignedTo: ["user@example.com"],
            taskProgress: "In progress",
        },
        {
            id: 3,
            taskName: "Do a mind sweep",
            taskDescription: "Clear your mind by writing down tasks",
            taskCreatedBy: currentUser.email,
            taskAssignedTo: ["user3@example.com"],
            taskProgress: "Completed",
        }
    ];

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
                <td onclick="showTaskDetails(${task.id})">${task.taskName}</td>
                <td onclick="showTaskDetails(${task.id})">${task.taskDescription}</td>
                <td onclick="showTaskDetails(${task.id})">${task.taskCreatedBy}</td>
                <td onclick="showTaskDetails(${task.id})">${task.taskAssignedTo.join(", ")}</td>
                <td onclick="showTaskDetails(${task.id})">${task.taskProgress}</td>
                <td class="actions">
                    <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                </td>
            `;
            activeTaskList.appendChild(row);
        });

        // Render completed tasks
        completedTasks.forEach(task => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td onclick="showTaskDetails(${task.id})">${task.taskName}</td>
                <td onclick="showTaskDetails(${task.id})">${task.taskDescription}</td>
                <td onclick="showTaskDetails(${task.id})">${task.taskCreatedBy}</td>
                <td onclick="showTaskDetails(${task.id})">${task.taskAssignedTo.join(", ")}</td>
                <td onclick="showTaskDetails(${task.id})">${task.taskProgress}</td>
                <td class="actions">
                    <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                </td>
            `;
            completedTaskList.appendChild(row);
        });

        // Update the task counts
        document.querySelector(".task-count").textContent = activeTasks.length;
        document.querySelector(".completed-task-count").textContent = completedTasks.length;
    }

    // Function to handle user roles
    function handleUserRole() {
        const allActivitiesLink = document.getElementById("allActivities");
        if (currentUser.isAdmin === true) {
            allActivitiesLink.style.display = "block"; // Show for admin
        } else {
            allActivitiesLink.style.display = "none"; // Hide for regular users
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
        
        // Set the 'Created By' field to the logged-in user's email
        document.getElementById("taskCreatedByDisplay").textContent = `Created By: ${currentUser.email}`;

        modal.style.display = "block";
    });

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
    window.editTask = function (taskId) {
        const task = tasks.find(task => task.id === taskId);
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
    window.deleteTask = function (taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        renderTasks(allActivitiesLink.classList.contains("active") ? "all" : "my");
    };

    // Handle form submission (create or update task)
    taskForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const taskName = document.getElementById("taskName").value;
        const taskDescription = document.getElementById("taskDescription").value;
        const taskAssignedTo = document.getElementById("taskAssignedTo").value.split(",").map(email => email.trim());
        const taskProgress = document.getElementById("taskProgress").value;

        // Use the logged-in user's email for 'Created By'
        const taskCreatedBy = currentUser.email;

        if (currentTaskId) {
            // Update existing task
            const taskIndex = tasks.findIndex(task => task.id === currentTaskId);
            if (taskIndex !== -1) {
                tasks[taskIndex] = {
                    ...tasks[taskIndex],
                    taskName,
                    taskDescription,
                    taskCreatedBy,
                    taskAssignedTo,
                    taskProgress
                };
            }
        } else {
            // Create new task
            const newTask = {
                id: tasks.length + 1,
                taskName,
                taskDescription,
                taskCreatedBy,
                taskAssignedTo,
                taskProgress
            };
            tasks.push(newTask);
        }

        renderTasks(allActivitiesLink.classList.contains("active") ? "all" : "my");
        modal.style.display = "none";
        taskForm.reset();
        currentTaskId = null;
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
        alert("Logging out...");
        // Add your logout logic here (e.g., redirect to login page)
        window.location.href = "/login";
    }

    // Initial setup
    handleUserRole(); // Handle user role on page load
    renderTasks("all"); // Render tasks initially
});