import { beforeEach, describe, expect, test, vi } from "vitest";

import { DOM_TYPES } from "../h";
import { mountDOM } from "../mount-dom";
import { BASE_NODE } from "./static/dom-api";

import * as attributes from "../attributes";

const TEXT_NODE_RESULT = "textNode";

const documentCreateElementMock = vi.fn(() => BASE_NODE);
const documentCreateTextNodeMock = vi.fn(() => TEXT_NODE_RESULT);

vi.stubGlobal("document", {
  createElement: documentCreateElementMock,
  createTextNode: documentCreateTextNodeMock,
});

describe("Функция mountDOM", () => {
  let NODE = {};

  beforeEach(() => {
    vi.clearAllMocks();

    NODE = BASE_NODE;
  });

  test("должен создать текстовую ноду", () => {
    const V_DOM = { type: DOM_TYPES.TEXT, value: "lorem" };
    mountDOM(V_DOM, NODE);

    expect(documentCreateTextNodeMock).toHaveBeenCalledWith(V_DOM.value);
    expect(BASE_NODE.append).toHaveBeenCalledWith(TEXT_NODE_RESULT);
    expect(V_DOM.el).toBe(TEXT_NODE_RESULT);
  });

  test("должен создать фрагментную ноду с текстами", () => {
    const V_DOM = {
      type: DOM_TYPES.FRAGMENT,
      children: [
        { type: DOM_TYPES.TEXT, value: "lorem" },
        { type: DOM_TYPES.TEXT, value: "ipsum" },
      ],
    };
    mountDOM(V_DOM, NODE);

    expect(documentCreateTextNodeMock).toHaveBeenCalledTimes(2);
    expect(V_DOM.el).toEqual(V_DOM.el);
  });

  test("должен создать ноду тега без пропсов", () => {
    const V_DOM = {
      type: DOM_TYPES.ELEMENT,
      tag: "h1",
      props: {},
      children: [],
    };
    const NODE_RESULT = {
      ...BASE_NODE,
      tag: V_DOM.tag,
    };

    documentCreateElementMock.mockReturnValueOnce(NODE_RESULT);

    mountDOM(V_DOM, NODE);

    expect(documentCreateElementMock).toHaveBeenCalledWith(V_DOM.tag);
    expect(V_DOM.el).toEqual(NODE_RESULT);
    expect(BASE_NODE.append).toHaveBeenCalledWith(
      expect.objectContaining(NODE_RESULT)
    );
  });

  test("должен добавить обработчик событий", () => {
    const clickHandler = vi.fn();
    const V_DOM = {
      type: DOM_TYPES.ELEMENT,
      tag: "button",
      props: {
        on: {
          click: clickHandler,
        },
      },
      children: [],
    };

    mountDOM(V_DOM, NODE);

    expect(V_DOM.listeners).toEqual({
      click: clickHandler,
    });
  });

  test("должен добавить атрибуты", () => {
    const setAttributeSpy = vi.spyOn(attributes, "setAttributes");

    const V_DOM = {
      type: DOM_TYPES.ELEMENT,
      tag: "a",
      props: {
        id: "id",
        class: "class_1 class_2",
        href: "http://sample.com",
        style: {
          fontSize: "14px",
        },
      },
      children: [],
    };

    mountDOM(V_DOM, NODE);

    expect(setAttributeSpy).toHaveBeenCalledWith(
      expect.objectContaining(NODE),
      expect.objectContaining(V_DOM.props)
    );
  });

  test("должен вызвать перебор children", () => {
    const forEachSpy = vi.spyOn(Array.prototype, "forEach");
    const V_DOM = {
      type: DOM_TYPES.ELEMENT,
      tag: "h1",
      props: {},
      children: [{ type: DOM_TYPES.TEXT, value: "lorem" }],
    };
    const NODE_RESULT = {
      ...BASE_NODE,
      tag: V_DOM.tag,
    };

    documentCreateElementMock.mockReturnValueOnce(NODE_RESULT);

    mountDOM(V_DOM, NODE);

    expect(forEachSpy).toHaveBeenCalled();
  });
});
