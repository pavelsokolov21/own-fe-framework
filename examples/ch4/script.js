import { h, hFragment, mountDOM, destroyDOM } from "own-fe-framework";

const POST_V_DOM_1 = hFragment([
  h("div", { class: "container" }, [
    h("h1", { class: "title" }, ["First"]),
    h("p", {}, ["Some paragraph first"]),
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

const POST_V_DOM_2 = hFragment([
  h("div", { class: "container" }, [
    h("h1", { class: "title" }, ["Second"]),
    h("p", {}, ["Some paragraph second"]),
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

const MAIN_V_DOM = hFragment([POST_V_DOM_1, POST_V_DOM_2]);

mountDOM(MAIN_V_DOM, document.querySelector("body"));

destroyDOM(POST_V_DOM_2);

console.log(MAIN_V_DOM);
