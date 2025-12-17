const STORAGE_KEY = "beautiful_todo_items";

const el = {
  input: document.getElementById("new-task"),
  addBtn: document.getElementById("add-btn"),
  list: document.getElementById("list"),
  empty: document.getElementById("empty"),
  count: document.getElementById("count"),
  filters: document.querySelectorAll(".filter"),
  clearCompleted: document.getElementById("clear-completed"),
  clearAll: document.getElementById("clear-all"),
};

let state = {
  items: JSON.parse(localStorage.getItem(STORAGE_KEY)) || [],
  filter: "all",
};

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
}

function render() {
  const items = filteredItems();
  el.list.innerHTML = "";
  if (items.length === 0) el.empty.hidden = false;
  else el.empty.hidden = true;

  items.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "item" + (task.completed ? " completed" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggle(index));

    const span = document.createElement("span");
    span.textContent = task.text;
    if (task.completed) span.classList.add("completed");

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.addEventListener("click", () => remove(index));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    el.list.appendChild(li);
  });

  el.count.textContent = `${state.items.length} item${state.items.length !== 1 ? "s" : ""}`;
}

function add() {
  const text = el.input.value.trim();
  if (!text) return;
  state.items.push({ text, completed: false });
  el.input.value = "";
  save();
  render();
}

function toggle(index) {
  state.items[index].completed = !state.items[index].completed;
  save();
  render();
}

function remove(index) {
  state.items.splice(index, 1);
  save();
  render();
}

function clearCompleted() {
  state.items = state.items.filter(t => !t.completed);
  save();
  render();
}

function clearAll() {
  state.items = [];
  save();
  render();
}

function setFilter(f) {
  state.filter = f;
  el.filters.forEach(btn => btn.classList.toggle("active", btn.dataset.filter === f));
  render();
}

function filteredItems() {
  if (state.filter === "active") return state.items.filter(t => !t.completed);
  if (state.filter === "completed") return state.items.filter(t => t.completed);
  return state.items;
}

// Events
el.addBtn.addEventListener("click", add);
el.input.addEventListener("keypress", e => { if (e.key === "Enter") add(); });
el.clearCompleted.addEventListener("click", clearCompleted);
el.clearAll.addEventListener("click", clearAll);
el.filters.forEach(btn => btn.addEventListener("click", () => setFilter(btn.dataset.filter)));

// Initial render
render();