import { expect, describe, it } from "vitest";
import { hFragment, h, DOM_TYPES } from "../h";

describe("Функция h", () => {
  it("должна построить верный виртуальный DOM", () => {
    expect(
      hFragment([
        h("h1", {}, ["My counter"]),
        h("div", { class: "container" }, [
          h("button", {}, ["decrement"]),
          h("span", {}, ["0"]),
          h("button", {}, ["increment"]),
        ]),
      ])
    ).toEqual({
      type: DOM_TYPES.FRAGMENT,
      children: [
        {
          type: DOM_TYPES.ELEMENT,
          tag: "h1",
          props: {},
          children: [
            {
              type: DOM_TYPES.TEXT,
              value: "My counter",
            },
          ],
        },
        {
          type: DOM_TYPES.ELEMENT,
          tag: "div",
          props: { class: "container" },
          children: [
            {
              type: DOM_TYPES.ELEMENT,
              tag: "button",
              props: {},
              children: [
                {
                  type: DOM_TYPES.TEXT,
                  value: "decrement",
                },
              ],
            },
            {
              type: DOM_TYPES.ELEMENT,
              tag: "span",
              props: {},
              children: [
                {
                  type: DOM_TYPES.TEXT,
                  value: "0",
                },
              ],
            },
            {
              type: DOM_TYPES.ELEMENT,
              tag: "button",
              props: {},
              children: [
                {
                  type: DOM_TYPES.TEXT,
                  value: "increment",
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it("должна построить верный виртуальный DOM с условные рендерингом", () => {
    expect(
      hFragment([
        h("h1", {}, ["My counter"]),
        h("div", { class: "container" }, [
          h("button", {}, ["decrement"]),
          undefined,
          null,
        ]),
      ])
    ).toEqual({
      type: DOM_TYPES.FRAGMENT,
      children: [
        {
          type: DOM_TYPES.ELEMENT,
          tag: "h1",
          props: {},
          children: [
            {
              type: DOM_TYPES.TEXT,
              value: "My counter",
            },
          ],
        },
        {
          type: DOM_TYPES.ELEMENT,
          tag: "div",
          props: { class: "container" },
          children: [
            {
              type: DOM_TYPES.ELEMENT,
              tag: "button",
              props: {},
              children: [
                {
                  type: DOM_TYPES.TEXT,
                  value: "decrement",
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
