import { beforeEach, describe, expect, test, vi } from "vitest";

import { BASE_NODE } from "./static/dom-api";
import { destroyDOM } from "../destroy-dom";
import { DOM_TYPES } from "../h";

import * as events from "../events";

const removeEventListenersSpy = vi.spyOn(events, "removeEventListeners");

describe("Функция destroyDOM", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("должен удалить текстовую ноду", () => {
    const V_DOM = { el: BASE_NODE, type: DOM_TYPES.TEXT, value: "lorem" };
    destroyDOM(V_DOM);

    expect(BASE_NODE.remove).toHaveBeenCalled();
    expect(V_DOM.el).toBeUndefined();
  });

  test("должен удалить ноду элемента и всех детей", () => {
    const forEachSpy = vi.spyOn(Array.prototype, "forEach");

    const V_DOM = {
      type: DOM_TYPES.ELEMENT,
      tag: "h1",
      el: BASE_NODE,
      props: {},
      children: [{ el: BASE_NODE, type: DOM_TYPES.TEXT, value: "lorem" }],
    };
    destroyDOM(V_DOM);

    expect(BASE_NODE.remove).toHaveBeenCalled();
    expect(V_DOM.el).toBeUndefined();
    expect(forEachSpy).toHaveBeenCalled();
  });

  test("должен удалить ноду элемента и отписать события", () => {
    const LISTENERS = {
      click: vi.fn(),
    };
    const V_DOM = {
      type: DOM_TYPES.ELEMENT,
      tag: "button",
      el: BASE_NODE,
      listeners: LISTENERS,
      children: [{ el: BASE_NODE, type: DOM_TYPES.TEXT, value: "lorem" }],
    };
    destroyDOM(V_DOM);

    expect(BASE_NODE.remove).toHaveBeenCalled();
    expect(removeEventListenersSpy).toHaveBeenCalled(
      expect.objectContaining(BASE_NODE),
      expect.objectContaining(LISTENERS)
    );
    expect(V_DOM.el).toBeUndefined();
    expect(V_DOM.listeners).toBeUndefined();
  });

  test("должен удалить фрагментную ноду", () => {
    const forEachSpy = vi.spyOn(Array.prototype, "forEach");

    const V_DOM = {
      type: DOM_TYPES.FRAGMENT,
      el: BASE_NODE,
      children: [
        {
          type: DOM_TYPES.ELEMENT,
          tag: "div",
          el: BASE_NODE,
          children: [{ el: BASE_NODE, type: DOM_TYPES.TEXT, value: "lorem" }],
        },
      ],
    };
    destroyDOM(V_DOM);

    expect(forEachSpy).toHaveBeenCalled();
  });
});
