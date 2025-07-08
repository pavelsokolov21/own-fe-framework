import { h, createApp, hFragment, defineComponent } from "own-fe-framework";

const Coffee = defineComponent({
  render() {
    return hFragment([
      h("h1", {}, ["Important news!"]),
      h("p", {}, ["I made myself coffee."]),
      h("button", { on: { click: () => console.log("Good for you") } }, [
        "Say congrats",
      ]),
    ]);
  },
});

const coffee = new Coffee();

coffee.mount(document.querySelector("body"), 1);
