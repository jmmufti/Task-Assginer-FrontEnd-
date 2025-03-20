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
    const taskAssignedToSelect = document.getElementById("taskAssignedTo");

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

    // Arrays to store tasks fetched from the API
    let tasks = [];
    let myTasks = [];
    let assignedTasks = [];

    // Function to fetch all tasks from the API
    async function fetchTasks() {
        try {
            const storedUser = JSON.parse(localStorage.getItem("user")); // Retrieve the user object from localStorage
            const token = storedUser ? storedUser.token : null; // Extract the token from the user object

            if (!token) {
                throw new Error("No token found, redirecting to login...");
            }

            const requestOptions = {
                method: "GET",
                credentials: "include", // Ensures cookies are sent with the request
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${token}` // Include the token in the Authorization header
                },
                redirect: "follow"
            };

            const response = await fetch("https://task-assginer.onrender.com/api/tasks/", requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            tasks = data.tasks; // Store the fetched tasks in the tasks array
        } catch (error) {
            console.error("Error fetching tasks:", error);
            alert("Failed to fetch tasks. Please try again.");
            window.location.href = "login.html"; // Redirect to login page if no token is found
        }
    }

    // Function to fetch my tasks from the API
    async function fetchMyTasks() {
        try {
            const storedUser = JSON.parse(localStorage.getItem("user")); // Retrieve the user object from localStorage
            const token = storedUser ? storedUser.token : null; // Extract the token from the user object

            if (!token) {
                throw new Error("No token found, redirecting to login...");
            }

            const requestOptions = {
                method: "GET",
                credentials: "include", // Ensures cookies are sent with the request
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${token}` // Include the token in the Authorization header
                },
                redirect: "follow"
            };

            const response = await fetch("https://task-assginer.onrender.com/api/tasks/mytasks", requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            myTasks = data; // Store the fetched tasks in the myTasks array
        } catch (error) {
            console.error("Error fetching my tasks:", error);
            alert("Failed to fetch my tasks. Please try again.");
        }
    }

    // Function to fetch assigned tasks from the API
    async function fetchAssignedTasks() {
        try {
            const storedUser = JSON.parse(localStorage.getItem("user")); // Retrieve the user object from localStorage
            const token = storedUser ? storedUser.token : null; // Extract the token from the user object

            if (!token) {
                throw new Error("No token found, redirecting to login...");
            }

            const requestOptions = {
                method: "GET",
                credentials: "include", // Ensures cookies are sent with the request
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${token}` // Include the token in the Authorization header
                },
                redirect: "follow"
            };

            const response = await fetch("https://task-assginer.onrender.com/api/tasks/assignedtasks", requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            assignedTasks = data; // Store the fetched tasks in the assignedTasks array
        } catch (error) {
            console.error("Error fetching assigned tasks:", error);
            alert("Failed to fetch assigned tasks. Please try again.");
        }
    }

    // Function to fetch users and populate the taskAssignedTo dropdown
    async function fetchUsers() {
        try {
            const storedUser = JSON.parse(localStorage.getItem("user")); // Retrieve the user object from localStorage
            const token = storedUser ? storedUser.token : null; // Extract the token from the user object

            if (!token) {
                throw new Error("No token found, redirecting to login...");
            }

            const requestOptions = {
                method: "GET",
                credentials: "include", // Ensures cookies are sent with the request
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${token}` // Include the token in the Authorization header
                },
                redirect: "follow"
            };

            const response = await fetch("https://task-assginer.onrender.com/api/auth/users", requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const users = await response.json();
            populateUserDropdown(users);
        } catch (error) {
            console.error("Error fetching users:", error);
            alert("Failed to fetch users. Please try again.");
        }
    }

    // Function to populate the taskAssignedTo dropdown with users
    function populateUserDropdown(users) {
        users.forEach(user => {
            const option = document.createElement("option");
            option.value = user;
            option.textContent = user;
            taskAssignedToSelect.appendChild(option);
        });
    }

    // Function to render task list
    function renderTaskList(taskList) {
        activeTaskList.innerHTML = "";
        completedTaskList.innerHTML = "";

        const activeTasks = taskList.filter(task => task.taskProgress !== "Completed");
        const completedTasks = taskList.filter(task => task.taskProgress === "Completed");

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

    // Function to show all tasks
    function showAllTasks() {
        renderTaskList(tasks);
    }

    // Function to show my tasks
    function showMyTasks() {
        renderTaskList(myTasks);
    }

    // Function to show assigned tasks
    function showAssignedTasks() {
        renderTaskList(assignedTasks);
    }

    // Event listeners for navigation links
    allActivitiesLink.addEventListener("click", function () {
        allActivitiesLink.classList.add("active");
        myActivitiesLink.classList.remove("active");
        createdTasksLink.classList.remove("active");
        showAllTasks(); // Show all tasks
    });

    myActivitiesLink.addEventListener("click", function () {
        myActivitiesLink.classList.add("active");
        allActivitiesLink.classList.remove("active");
        createdTasksLink.classList.remove("active");
        showAssignedTasks(); // Show assigned tasks
    });

    createdTasksLink.addEventListener("click", function () {
        createdTasksLink.classList.add("active");
        allActivitiesLink.classList.remove("active");
        myActivitiesLink.classList.remove("active");
        showMyTasks(); // Show my tasks
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
                const storedUser = JSON.parse(localStorage.getItem("user")); // Retrieve the user object from localStorage
                const token = storedUser ? storedUser.token : null; // Extract the token from the user object

                const response = await fetch(`https://task-assginer.onrender.com/api/tasks/${taskId}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to delete task");
                }

                const result = await response.json();
                if (result.message === "Task deleted successfully") {
                    tasks = tasks.filter(task => task._id !== taskId); // Remove the task from the local array
                    renderTaskList(allActivitiesLink.classList.contains("active") ? tasks : myActivitiesLink.classList.contains("active") ? assignedTasks : myTasks);
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
        const taskAssignedTo = [document.getElementById("taskAssignedTo").value]; // Wrap the selected email in an array
        const taskProgress = document.getElementById("taskProgress").value;

        const taskData = {
            taskName,
            taskDescription,
            taskAssignedTo,
            taskProgress
        };

        try {
            let response;
            const storedUser = JSON.parse(localStorage.getItem("user")); // Retrieve the user object from localStorage
            const token = storedUser ? storedUser.token : null; // Extract the token from the user object

            if (currentTaskId) {
                // Update existing task
                response = await fetch(`https://task-assginer.onrender.com/api/tasks/${currentTaskId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `${token}`
                    },
                    body: JSON.stringify(taskData)
                });
            } else {
                // Create new task
                response = await fetch("https://task-assginer.onrender.com/api/tasks/addtask", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `${token}`
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

            renderTaskList(allActivitiesLink.classList.contains("active") ? tasks : myActivitiesLink.classList.contains("active") ? assignedTasks : myTasks);
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
        const storedUser = JSON.parse(localStorage.getItem("user")); // Retrieve the user object from localStorage
        const token = storedUser ? storedUser.token : null; // Extract the token from the user object
    
        if (!token) {
            alert("You are not logged in.");
            window.location.href = "login.html"; // Redirect to login page
            return;
        }
    
        fetch("https://task-assginer.onrender.com/api/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse the response JSON
            } else {
                throw new Error("Failed to logout");
            }
        })
        .then(data => {
            // Store the API response in localStorage
            localStorage.setItem("user", JSON.stringify({
                _id: data._id,
                username: data.username,
                email: data.email,
                isAdmin: data.isAdmin,
                token: data.token
            }));
    
            alert("Logged out successfully");
            window.location.href = "login.html"; // Redirect to login page
        })
        .catch(error => {
            console.error("Error logging out:", error);
            alert("Failed to logout. Please try again.");
        });
    }
    // Initial setup
    handleUserRole(); // Handle user role on page load
    fetchTasks(); // Fetch all tasks from the API on page load
    fetchMyTasks(); // Fetch my tasks from the API on page load
    fetchAssignedTasks(); // Fetch assigned tasks from the API on page load
    fetchUsers(); // Fetch users and populate the taskAssignedTo dropdown on page load
});