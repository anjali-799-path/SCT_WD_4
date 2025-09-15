let taskId = 0;

// Live Date & Time
function updateDateTime() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById("date-time").textContent =
    `${now.toLocaleDateString(undefined, options)} | ${now.toLocaleTimeString()}`;
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Update status counts
function updateStatus() {
  const totalTasks = document.querySelectorAll("#taskTable tr").length;
  const completedTasks = document.querySelectorAll("#taskTable tr.completed").length;
  document.getElementById("pendingCount").textContent = totalTasks - completedTasks;
  document.getElementById("completedCount").textContent = completedTasks;
}

// Add new task
function addTask() {
  const input = document.getElementById("taskInput");
  const alarmInput = document.getElementById("alarmTime");
  const task = input.value.trim();
  const alarmValue = alarmInput.value;

  if (task === "") {
    alert("Please enter a task!");
    return;
  }

  taskId++;
  const tbody = document.getElementById("taskTable");

  const row = document.createElement("tr");
  row.setAttribute("data-id", taskId);
  row.setAttribute("data-alarm", alarmValue);

  const idCell = document.createElement("td");
  idCell.textContent = taskId;

  const taskCell = document.createElement("td");
  taskCell.textContent = task;

  const timeCell = document.createElement("td");
  timeCell.textContent = new Date().toLocaleString();

  const alarmCell = document.createElement("td");
  alarmCell.textContent = alarmValue ? new Date(alarmValue).toLocaleString() : "—";

  const statusCell = document.createElement("td");
  const statusBadge = document.createElement("span");
  statusBadge.textContent = "Pending";
  statusBadge.className = "badge bg-warning text-dark status-badge";
  statusCell.appendChild(statusBadge);

  const actionCell = document.createElement("td");
  const completeBtn = document.createElement("button");
  completeBtn.textContent = "Complete";
  completeBtn.className = "btn btn-sm btn-success me-2";
  completeBtn.onclick = function () {
    row.classList.toggle("completed");
    if (row.classList.contains("completed")) {
      statusBadge.textContent = "Completed";
      statusBadge.className = "badge bg-success";
      completeBtn.textContent = "Undo";
    } else {
      statusBadge.textContent = "Pending";
      statusBadge.className = "badge bg-warning text-dark";
      completeBtn.textContent = "Complete";
    }
    updateStatus();
  };

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.className = "btn btn-sm btn-danger";
  delBtn.onclick = function () {
    row.remove();
    updateStatus();
  };

  actionCell.appendChild(completeBtn);
  actionCell.appendChild(delBtn);

  row.appendChild(idCell);
  row.appendChild(taskCell);
  row.appendChild(timeCell);
  row.appendChild(alarmCell);
  row.appendChild(statusCell);
  row.appendChild(actionCell);

  tbody.appendChild(row);

  input.value = "";
  alarmInput.value = "";
  updateStatus();
}

// Check alarms
setInterval(() => {
  const now = new Date();
  const rows = document.querySelectorAll("#taskTable tr:not(.completed)");

  rows.forEach(row => {
    const alarmTime = row.getAttribute("data-alarm");
    if (alarmTime && new Date(alarmTime) <= now) {
      const alarmSound = document.getElementById("alarmSound");
      alarmSound.play();
      alert("⏰ Reminder: " + row.children[1].textContent);
      row.setAttribute("data-alarm", ""); // Prevent repeat
    }
  });
}, 1000);
