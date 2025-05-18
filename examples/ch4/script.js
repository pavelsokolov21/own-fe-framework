import { h, hFragment, mountDOM, destroyDOM } from "own-fe-framework";

const PostFirst = hFragment([
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

const PostSecond = hFragment([
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

const App = hFragment([PostFirst, PostSecond]);

mountDOM(App, document.querySelector("body"));

destroyDOM(PostSecond);

console.log(App);
