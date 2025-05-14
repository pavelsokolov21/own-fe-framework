let voices = speechSynthesis.getVoices();

speechSynthesis.onvoiceschanged = () => {
  voices = speechSynthesis.getVoices();
};

const getId = () => Math.random().toString(16).slice(2);

const TODOS = new Map(
  ["foo", "bar", "bazz"].map((todo) => [
    getId(),
    { todo, node: null, isDone: false },
  ])
);

const addTodoInput = document.getElementById("todo-input");
const addTodoBtn = document.getElementById("add-todo-btn");
const todoList = document.getElementById("todo-list");

const hasTodoByName = (todo) => {
  let res = false;

  for (const value of TODOS.values()) {
    if (value.todo === todo) {
      res = true;

      break;
    }
  }

  return res;
};

const notifyAboutDuplicatedTodo = (todo) => {
  alert(`Todo "${todo}" is already exists`);
};

const speechTodo = (value) => {
  const speechSynthesisUtterance = new SpeechSynthesisUtterance();

  const voice = voices["205"];

  speechSynthesisUtterance.text = value;
  speechSynthesisUtterance.voice = voice;
  speechSynthesisUtterance.lang = voice.lang;
  speechSynthesisUtterance.volume = 1;
  speechSynthesisUtterance.rate = 1;
  speechSynthesisUtterance.pitch = 1;

  speechSynthesis.speak(speechSynthesisUtterance);
};

function renderTodoInReadMode(id, todo) {
  const li = document.createElement("li");
  li.classList.add("todo-list__item");

  const text = document.createElement("span");
  text.textContent = todo;
  text.addEventListener("dblclick", () => {
    const savedNodeMeta = TODOS.get(id);

    if (savedNodeMeta.isDone) {
      return;
    }

    const editableNode = renderTodoInEditMode(id, todo);
    const parent = savedNodeMeta.node.parentNode;

    parent.replaceChild(editableNode, savedNodeMeta.node);
    TODOS.set(id, { ...savedNodeMeta, node: editableNode });
  });

  const doneBtn = document.createElement("button");
  doneBtn.textContent = "Done";
  doneBtn.setAttribute("data-action", "done");
  doneBtn.addEventListener("click", () => {
    // removeTodo(id);
    markTodoAsDone(id);
  });

  li.appendChild(text);
  li.appendChild(doneBtn);

  return li;
}

function renderTodoInEditMode(id, todo) {
  const li = document.createElement("li");
  li.classList.add("todo-list__item");

  const input = document.createElement("input");
  input.value = todo;

  const actionsContainer = document.createElement("div");
  actionsContainer.classList.add("todo-list__actions");

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.addEventListener("click", () => {
    if (hasTodoByName(addTodoInput.value)) {
      notifyAboutDuplicatedTodo(addTodoInput.value);

      return;
    }

    updateTodo(id, input.value);
  });

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.addEventListener("click", () => {
    updateTodo(id, todo);
  });

  actionsContainer.appendChild(saveBtn);
  actionsContainer.appendChild(cancelBtn);

  li.appendChild(input);
  li.appendChild(actionsContainer);

  return li;
}

function removeTodo(id) {
  const nodeMeta = TODOS.get(id);
  const parent = nodeMeta.node.parentNode;

  parent.removeChild(nodeMeta.node);
  TODOS.delete(id);
}

function markTodoAsDone(id) {
  const nodeMeta = TODOS.get(id);

  nodeMeta.node.classList.add("todo-list__item_done");
  const doneBtn = nodeMeta.node.querySelector('button[data-action="done"]');
  doneBtn.disabled = true;
  TODOS.set(id, { ...nodeMeta, isDone: true });
}

function addTodo(value) {
  const id = getId();
  const newTodoNode = renderTodoInReadMode(id, value);

  TODOS.set(id, { node: newTodoNode, todo: value });
  todoList.appendChild(newTodoNode);
}

function updateTodo(id, value) {
  const readableTodo = renderTodoInReadMode(id, value);
  const savedNodeMeta = TODOS.get(id);
  const parent = savedNodeMeta.node.parentNode;

  parent.replaceChild(readableTodo, savedNodeMeta.node);
  TODOS.set(id, { ...savedNodeMeta, node: readableTodo, todo: value });
}

TODOS.forEach(({ todo }, id) => {
  const node = renderTodoInReadMode(id, todo);

  TODOS.set(id, { ...TODOS.get(id), node });

  todoList.appendChild(node);
});

addTodoInput.addEventListener("input", (e) => {
  addTodoBtn.disabled = e.target.value.length < 3;
});

addTodoInput.addEventListener("keydown", ({ key }) => {
  if (key === "Enter" && addTodoInput.value.length >= 3) {
    if (hasTodoByName(addTodoInput.value)) {
      notifyAboutDuplicatedTodo(addTodoInput.value);

      return;
    }

    addTodo(addTodoInput.value);
    speechTodo(addTodoInput.value);
  }
});

addTodoBtn.addEventListener("click", () => {
  if (hasTodoByName(addTodoInput.value)) {
    notifyAboutDuplicatedTodo(addTodoInput.value);

    return;
  }

  addTodo(addTodoInput.value);
  speechTodo(addTodoInput.value);
});
