import { h, hString, createApp, hFragment } from "own-fe-framework";

let voices = speechSynthesis.getVoices();

speechSynthesis.onvoiceschanged = () => {
  voices = speechSynthesis.getVoices();
};

const getId = () => Math.random().toString(16).slice(2);

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

const TODO_MODES = {
  EDIT: "edit",
  READ: "read",
};

const createTodo = (todo) => ({
  value: todo,
  editingValue: todo,
  isDone: false,
  mode: TODO_MODES.READ,
});

const state = {
  currentTodo: "",
  todos: Object.fromEntries(
    ["First", "Second"].map((todo) => [getId(), createTodo(todo)])
  ),
};

const reducers = {
  changeCurrentTodo: (state, value) => {
    return {
      ...state,
      currentTodo: value,
    };
  },
  addTodo: (state) => {
    return {
      ...state,
      currentTodo: "",
      todos: {
        ...state.todos,
        [getId()]: createTodo(state.currentTodo),
      },
    };
  },
  editTodo: (state, id) => {
    return {
      ...state,
      todos: {
        ...state.todos,
        [id]: {
          ...state.todos[id],
          value: state.todos[id].editingValue,
        },
      },
    };
  },
  cancelEditingTodo: (state, id) => {
    return {
      ...state,
      todos: {
        ...state.todos,
        [id]: {
          ...state.todos[id],
          mode: TODO_MODES.READ,
          editingValue: state.todos[id].value,
        },
      },
    };
  },
  saveEditedTodo: (state, { id }) => {
    return {
      ...state,
      todos: {
        ...state.todos,
        [id]: {
          ...state.todos[id],
          mode: TODO_MODES.READ,
          value: state.todos[id].editingValue,
        },
      },
    };
  },
  changeEditModeTodo: (state, { id, value }) => {
    return {
      ...state,
      todos: {
        ...state.todos,
        [id]: {
          ...state.todos[id],
          editingValue: value,
        },
      },
    };
  },
  markTodoAsEditing: (state, id) => {
    return {
      ...state,
      todos: {
        ...state.todos,
        [id]: {
          ...state.todos[id],
          mode: TODO_MODES.EDIT,
        },
      },
    };
  },
  markTodoAsRead: (state, id) => {
    return {
      ...state,
      todos: {
        ...state.todos,
        [id]: {
          ...state.todos[id],
          mode: TODO_MODES.READ,
        },
      },
    };
  },
  markTodoAsDone: (state, id) => {
    return {
      ...state,
      todos: {
        ...state.todos,
        [id]: {
          ...state.todos[id],
          isDone: true,
        },
      },
    };
  },
};

const CreateTodo = (props) => {
  const { currentTodo, onChange, onSubmit } = props;

  const submitTodo = () => {
    onSubmit(currentTodo);
  };

  return h("div", { class: "new-todo-container" }, [
    h("label", { class: "input-container" }, [
      h("span", {}, ["New TODO"]),
      h("input", {
        type: "text",
        value: currentTodo,
        on: {
          input: ({ target }) => {
            onChange(target.value);
          },
          keydown: ({ key }) => {
            if (key === "Enter") {
              submitTodo();
            }
          },
        },
      }),
    ]),
    h(
      "button",
      {
        disabled: currentTodo.length < 3,
        on: {
          click: submitTodo,
        },
      },
      ["Add"]
    ),
  ]);
};

const TodoList = (props) => {
  const { todos, onMarkAsDone, onSwitchToEditMode, onSave, onCancel, onEdit } =
    props;

  const isTodoInEditMode = (todo) => {
    return todo.mode === TODO_MODES.EDIT;
  };

  return h(
    "ul",
    { class: "todo-list" },
    Object.entries(todos).map(([id, { value, editingValue, isDone }]) => {
      return h(
        "li",
        {
          class: [
            [true, "todo-list__item"],
            [isDone, "todo-list__item_done"],
          ]
            .filter((p) => p[0])
            .map((p) => p[1]),
        },
        [
          isTodoInEditMode(todos[id])
            ? hFragment([
                h("input", {
                  type: "text",
                  value: editingValue,
                  on: {
                    input: (event) => {
                      onEdit(id, event.target.value);
                    },
                  },
                }),
                h("div", { class: "todo-list__actions" }, [
                  h(
                    "button",
                    {
                      on: {
                        click: () => {
                          onSave(id);
                        },
                      },
                    },
                    ["Save"]
                  ),
                  h(
                    "button",
                    {
                      on: {
                        click: () => {
                          onCancel(id);
                        },
                      },
                    },
                    ["Cancel"]
                  ),
                ]),
              ])
            : hFragment([
                h(
                  "span",
                  {
                    role: "button",
                    on: {
                      dblclick: () => {
                        onSwitchToEditMode(id);
                      },
                    },
                  },
                  [hString(value)]
                ),
                h(
                  "button",
                  {
                    disabled: isDone,
                    on: {
                      click: () => {
                        onMarkAsDone(id);
                      },
                    },
                  },
                  ["Done"]
                ),
              ]),
        ]
      );
    })
  );
};

createApp({
  state,
  view: (state, emit) => {
    const isTodoAlreadyExistsByValue = (value) => {
      return Object.values(state.todos).some((todo) => todo.value === value);
    };

    return h("main", {}, [
      h("section", {}, [
        h("h1", { class: "title" }, ["My TODO"]),
        CreateTodo({
          currentTodo: state.currentTodo,
          onChange: (value) => {
            emit("changeCurrentTodo", value);
          },
          onSubmit: (value) => {
            if (isTodoAlreadyExistsByValue(value)) {
              notifyAboutDuplicatedTodo(value);

              return;
            }

            if (value.length < 3) {
              return;
            }

            emit("addTodo");
            speechTodo(value);
          },
        }),
        TodoList({
          todos: state.todos,
          onEdit: (id, value) => {
            emit("changeEditModeTodo", { id, value });
          },
          onSave: (id) => {
            emit("saveEditedTodo", { id });
          },
          onCancel: (id) => {
            emit("cancelEditingTodo", id);
          },
          onMarkAsDone: (id) => {
            emit("markTodoAsDone", id);
          },
          onSwitchToEditMode: (id) => {
            emit("markTodoAsEditing", id);
          },
        }),
      ]),
    ]);
  },
  reducers,
}).mount(document.getElementById("app"));
