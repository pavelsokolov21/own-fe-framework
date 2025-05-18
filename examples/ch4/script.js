import { h, hFragment, mountDOM } from "own-fe-framework";

const vdom = hFragment([
  h("div", { class: "container" }, [
    h("h1", { class: "title" }, ["Some title"]),
    h("p", {}, ["Some paragraph"]),
    h("a", { href: "https://ru.wikipedia.org/?l" }, ["Wiki"]),
    h(
      "button",
      {
        on: {
          click: () => {
            console.log("Click");
          },
        },
      },
      ["Click me"]
    ),
  ]),
]);

mountDOM(vdom, document.querySelector("body"));
