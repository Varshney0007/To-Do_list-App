const STORAGE_KEY = "simple_todo_items_v1";

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
  items: loadItems(),
  filter: "all",
};

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
}
function uid() {
  return Math.random().toString(36).slice(2, 9);
}
function addItem(title) {
  const trimmed = title.trim();
  if (!trimmed) return;
  state.items.push({ id: uid(), title: trimmed, completed: false });
  saveItems();
  render();
}
function removeItem(id) {
  state.items = state.items.filter(it => it.id !== id);
  saveItems();
  render();
}
function toggleItem(id) {
  const it = state.items.find(i => i.id === id);
  if (it) it.completed = !it.completed;
  saveItems();
  render();
}
function clearCompleted() {
  state.items = state.items.filter(it => !it.completed);
  saveItems();
  render();
}
function clearAll() {
  if (!state.items.length) return;
  if (confirm("Clear all tasks?")) {
    state.items = [];
    saveItems();
    render();
  }
}
function setFilter(filter) {
  state.filter = filter;
  document.querySelectorAll(".filter").forEach(btn =>
    btn.classList.toggle("active", btn.dataset.filter === filter)
  );
  renderList();
}
function filteredItems() {
  if (state.filter === "active") return state.items.filter(i => !i.completed);
  if (state.filter === "completed") return state.items.filter(i => i.completed);
  return state.items;
}
function render() {
  renderList();
  el.count.textContent = `${state.items.length} item${state.items.length === 1 ? "" : "s"}`;
  el.empty.hidden = state.items.length > 0;
}
function renderList() {
  const items = filteredItems();
  el.list.innerHTML = "";
  for (const it of items) {
    const li = document.createElement("li");
    li.className = "item" + (it.completed ? " completed" : "");
    li.innerHTML = `
      <label>
        <input type="checkbox" ${it.completed ? "checked" : ""}/>
        <span class="title ${it.completed ? "completed" : ""}">${escapeHtml(it.title)}</span>
      </label>
      <button class="btn-clear">🗑️</button>
    `;
    li.querySelector("input").addEventListener("change", () => toggleItem(it.id));
    li.querySelector("button").addEventListener("click", () => removeItem(it.id));
    el.list.appendChild(li);
  }
}