const students = [
  { id: "S101", name: "Aarav Sharma", year: "1st year", preference: "quiet" },
  { id: "S102", name: "Maya Iyer", year: "2nd year", preference: "study" },
  { id: "S103", name: "Kabir Khan", year: "1st year", preference: "sports" },
  { id: "S104", name: "Nisha Patel", year: "3rd year", preference: "quiet" },
  { id: "S105", name: "Rohan Das", year: "2nd year", preference: "study" },
  { id: "S106", name: "Sara Thomas", year: "1st year", preference: "sports" },
  { id: "S107", name: "Dev Mehta", year: "3rd year", preference: "quiet" },
  { id: "S108", name: "Ira Sen", year: "2nd year", preference: "study" }
];

const state = {
  attendance: [],
  feedback: [
    { student: "Maya Iyer", rating: 4, text: "Dinner was fresh and service was quick.", sentiment: "Positive" },
    { student: "Rohan Das", rating: 3, text: "Breakfast was okay but tea was cold.", sentiment: "Neutral" }
  ],
  complaints: [
    { id: "C-1001", student: "Kabir Khan", category: "Water supply", priority: "High", text: "Low water pressure on floor 2.", status: "Open" },
    { id: "C-1002", student: "Nisha Patel", category: "Mess quality", priority: "Medium", text: "Rice was undercooked at lunch.", status: "In Progress" }
  ],
  visitors: [
    { name: "Anita Sharma", student: "Aarav Sharma", purpose: "Parent visit", time: "10:30 AM", status: "Checked in" }
  ],
  rooms: [
    { room: "A-101", capacity: 3, students: ["Aarav Sharma", "Nisha Patel"] },
    { room: "A-102", capacity: 3, students: ["Maya Iyer"] },
    { room: "B-201", capacity: 2, students: ["Kabir Khan"] },
    { room: "B-202", capacity: 2, students: [] }
  ]
};

const titles = {
  dashboard: "Dashboard",
  attendance: "QR Attendance",
  feedback: "Mess Feedback Analysis",
  complaints: "Complaint System",
  visitors: "Visitor Management",
  rooms: "Room Allocation Optimization"
};

const positiveWords = ["fresh", "good", "great", "quick", "clean", "tasty", "excellent", "hot"];
const negativeWords = ["bad", "cold", "slow", "dirty", "late", "undercooked", "poor", "stale"];

function $(selector) {
  return document.querySelector(selector);
}

function optionList() {
  return students.map((student) => `<option value="${student.id}">${student.name} (${student.id})</option>`).join("");
}

function studentName(id) {
  return students.find((student) => student.id === id)?.name ?? id;
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function setToday() {
  $("#today").textContent = new Date().toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}

function switchView(view) {
  document.querySelectorAll(".view").forEach((element) => element.classList.remove("active"));
  document.querySelectorAll(".nav-button").forEach((button) => button.classList.remove("active"));
  $(`#${view}`).classList.add("active");
  document.querySelector(`[data-view="${view}"]`).classList.add("active");
  $("#page-title").textContent = titles[view];
}

function renderDashboard() {
  $("#attendance-count").textContent = state.attendance.length;
  const ratingAverage = state.feedback.reduce((sum, item) => sum + item.rating, 0) / state.feedback.length;
  $("#rating-average").textContent = ratingAverage.toFixed(1);
  $("#open-complaints").textContent = state.complaints.filter((item) => item.status !== "Resolved").length;
  $("#visitor-count").textContent = state.visitors.length;

  $("#recent-attendance").innerHTML = state.attendance.length
    ? state.attendance.slice(-5).reverse().map(activityItem).join("")
    : `<div class="activity-item"><div><strong>No attendance marked yet</strong><span>Generate and scan a QR token to start.</span></div></div>`;

  const priority = state.complaints
    .filter((item) => item.status !== "Resolved")
    .sort((a, b) => priorityScore(b.priority) - priorityScore(a.priority));

  $("#priority-list").innerHTML = priority.length
    ? priority.map((item) => `<div class="activity-item"><div><strong>${item.id}: ${item.category}</strong><span>${item.student} - ${item.text}</span></div><span>${item.priority}</span></div>`).join("")
    : `<div class="activity-item"><div><strong>All clear</strong><span>No open complaints.</span></div></div>`;
}

function priorityScore(priority) {
  return { Low: 1, Medium: 2, High: 3 }[priority] ?? 0;
}

function activityItem(item) {
  return `<div class="activity-item"><div><strong>${item.student}</strong><span>${item.meal} marked through ${item.method}</span></div><span>${item.time}</span></div>`;
}

function renderQr(token) {
  const cells = Array.from({ length: 49 }, (_, index) => {
    const dark = (token.charCodeAt(index % token.length) + index * 7) % 3 !== 0;
    return `<span class="qr-cell ${dark ? "dark" : ""}"></span>`;
  }).join("");
  $("#qr-card").innerHTML = `<div><div class="qr-box">${cells}</div><div class="qr-token">${token}</div></div>`;
}

function renderAttendance() {
  $("#attendance-log").innerHTML = state.attendance.length
    ? state.attendance.slice().reverse().map(activityItem).join("")
    : `<div class="activity-item"><div><strong>Waiting for scan</strong><span>Attendance entries will appear here.</span></div></div>`;
}

function analyzeSentiment(text, rating) {
  const normalized = text.toLowerCase();
  const positive = positiveWords.filter((word) => normalized.includes(word)).length;
  const negative = negativeWords.filter((word) => normalized.includes(word)).length;
  if (rating >= 4 && positive >= negative) return "Positive";
  if (rating <= 2 || negative > positive) return "Negative";
  return "Neutral";
}

function renderFeedback() {
  const latest = state.feedback[state.feedback.length - 1];
  $("#sentiment-badge").textContent = latest?.sentiment ?? "Neutral";
  $("#sentiment-badge").className = `pill ${latest?.sentiment === "Positive" ? "success" : latest?.sentiment === "Negative" ? "danger" : "warning"}`;
  $("#feedback-insights").innerHTML = latest
    ? `<strong>${latest.sentiment} feedback from ${latest.student}</strong><p>${latest.text}</p><span>Rating: ${latest.rating}/5</span>`
    : "Feedback insights will appear after analysis.";
  $("#feedback-list").innerHTML = state.feedback.slice().reverse().map((item) => (
    `<div class="activity-item"><div><strong>${item.student}</strong><span>${item.text}</span></div><span>${item.rating}/5</span></div>`
  )).join("");
}

function renderComplaints() {
  $("#complaint-list").innerHTML = state.complaints.map((item) => (
    `<article class="ticket">
      <div class="ticket-row">
        <div><strong>${item.id} - ${item.category}</strong><span>${item.student}</span></div>
        <span class="pill ${item.priority === "High" ? "danger" : item.priority === "Medium" ? "warning" : "success"}">${item.priority}</span>
      </div>
      <p>${item.text}</p>
      <div class="ticket-row">
        <span>Status: ${item.status}</span>
        <div class="ticket-actions">
          <button class="secondary" data-progress="${item.id}">Move Forward</button>
          <button class="secondary" data-resolve="${item.id}">Resolve</button>
        </div>
      </div>
    </article>`
  )).join("");
}

function updateComplaint(id, action) {
  const complaint = state.complaints.find((item) => item.id === id);
  if (!complaint) return;
  if (action === "resolve") complaint.status = "Resolved";
  if (action === "progress") {
    complaint.status = complaint.status === "Open" ? "In Progress" : "Resolved";
  }
  renderAll();
}

function renderVisitors() {
  $("#visitor-list").innerHTML = state.visitors.slice().reverse().map((item) => (
    `<div class="activity-item"><div><strong>${item.name}</strong><span>Visiting ${item.student} - ${item.purpose}</span></div><span>${item.time}</span></div>`
  )).join("");
}

function optimizeRooms() {
  const rooms = state.rooms.map((room) => ({ ...room, students: [] }));
  const grouped = students.reduce((acc, student) => {
    acc[student.preference] = acc[student.preference] || [];
    acc[student.preference].push(student.name);
    return acc;
  }, {});
  const queue = Object.values(grouped).flat();
  queue.forEach((name) => {
    const room = rooms.sort((a, b) => a.students.length / a.capacity - b.students.length / b.capacity)
      .find((item) => item.students.length < item.capacity);
    if (room) room.students.push(name);
  });
  state.rooms = rooms;
  renderRooms();
}

function renderRooms() {
  $("#room-grid").innerHTML = state.rooms.map((room) => (
    `<article class="room-card">
      <div class="ticket-row"><strong>${room.room}</strong><span>${room.students.length}/${room.capacity} occupied</span></div>
      <div>${room.students.map((student) => `<span class="student-chip">${student}</span>`).join("") || "<span>No students allocated</span>"}</div>
    </article>`
  )).join("");
}

function renderAll() {
  renderDashboard();
  renderAttendance();
  renderFeedback();
  renderComplaints();
  renderVisitors();
  renderRooms();
}

function bindEvents() {
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });

  $("#generate-qr").addEventListener("click", () => {
    const token = `HOSTEL-${$("#student-select").value}-${$("#meal-select").value.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    $("#qr-input").value = token;
    renderQr(token);
  });

  $("#mark-attendance").addEventListener("click", () => {
    const token = $("#qr-input").value.trim();
    const parts = token.split("-");
    if (parts[0] !== "HOSTEL" || !parts[1] || !parts[2]) {
      $("#qr-card").innerHTML = "Invalid QR token.";
      return;
    }
    state.attendance.push({ student: studentName(parts[1]), meal: parts[2], method: "QR", time: nowTime() });
    $("#qr-input").value = "";
    renderAll();
  });

  $("#submit-feedback").addEventListener("click", () => {
    const text = $("#feedback-text").value.trim();
    if (!text) return;
    const rating = Number($("#rating").value);
    state.feedback.push({
      student: studentName($("#feedback-student").value),
      rating,
      text,
      sentiment: analyzeSentiment(text, rating)
    });
    $("#feedback-text").value = "";
    renderAll();
  });

  $("#create-complaint").addEventListener("click", () => {
    const text = $("#complaint-text").value.trim();
    if (!text) return;
    state.complaints.push({
      id: `C-${1001 + state.complaints.length}`,
      student: studentName($("#complaint-student").value),
      category: $("#complaint-category").value,
      priority: $("#complaint-priority").value,
      text,
      status: "Open"
    });
    $("#complaint-text").value = "";
    renderAll();
  });

  $("#complaint-list").addEventListener("click", (event) => {
    const progressId = event.target.dataset.progress;
    const resolveId = event.target.dataset.resolve;
    if (progressId) updateComplaint(progressId, "progress");
    if (resolveId) updateComplaint(resolveId, "resolve");
  });

  $("#register-visitor").addEventListener("click", () => {
    const name = $("#visitor-name").value.trim();
    const purpose = $("#visitor-purpose").value.trim();
    if (!name || !purpose) return;
    state.visitors.push({
      name,
      student: studentName($("#visitor-student").value),
      purpose,
      time: nowTime(),
      status: "Checked in"
    });
    $("#visitor-name").value = "";
    $("#visitor-purpose").value = "";
    renderAll();
  });

  $("#optimize-rooms").addEventListener("click", optimizeRooms);
  $("#reset-rooms").addEventListener("click", () => {
    state.rooms = [
      { room: "A-101", capacity: 3, students: ["Aarav Sharma", "Nisha Patel"] },
      { room: "A-102", capacity: 3, students: ["Maya Iyer"] },
      { room: "B-201", capacity: 2, students: ["Kabir Khan"] },
      { room: "B-202", capacity: 2, students: [] }
    ];
    renderRooms();
  });

  $("#export-summary").addEventListener("click", () => {
    const summary = [
      `Smart Hostel Summary`,
      `Attendance: ${state.attendance.length}`,
      `Feedback entries: ${state.feedback.length}`,
      `Open complaints: ${state.complaints.filter((item) => item.status !== "Resolved").length}`,
      `Visitors today: ${state.visitors.length}`
    ].join("\n");
    navigator.clipboard?.writeText(summary);
    $("#export-summary").textContent = "Copied";
    setTimeout(() => {
      $("#export-summary").textContent = "Export Summary";
    }, 1200);
  });
}

function init() {
  setToday();
  ["#student-select", "#feedback-student", "#complaint-student", "#visitor-student"].forEach((selector) => {
    $(selector).innerHTML = optionList();
  });
  bindEvents();
  renderAll();
  renderQr("Generate a token to create QR preview");
}

init();
