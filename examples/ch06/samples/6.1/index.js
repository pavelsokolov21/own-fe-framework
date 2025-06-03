import { h, hString, createApp } from "own-fe-framework";

createApp({
  state: 0,
  reducers: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
  },
  view: (state, emit) => {
    return h("div", {}, [
      h("h1", {}, ["COUNTER"]),
      h("div", { class: "counter" }, [
        h("button", { on: { click: () => emit("decrement") } }, ["-"]),
        h("span", {}, [hString(state)]),
        h("button", { on: { click: () => emit("increment") } }, ["+"]),
      ]),
    ]);
  },
}).mount(document.getElementById("app"));
