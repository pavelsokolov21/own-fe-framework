import { beforeEach, describe, expect, it, vi } from "vitest";

import { DOM_TYPES } from "../h";
import { insert, mountDOM } from "../mount-dom";
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

  it("должен создать текстовую ноду", () => {
    const V_DOM = { type: DOM_TYPES.TEXT, value: "lorem" };
    mountDOM(V_DOM, NODE);

    expect(documentCreateTextNodeMock).toHaveBeenCalledWith(V_DOM.value);
    expect(BASE_NODE.append).toHaveBeenCalledWith(TEXT_NODE_RESULT);
    expect(V_DOM.el).toBe(TEXT_NODE_RESULT);
  });

  it("должен создать фрагментную ноду с текстами", () => {
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

  it("должен создать ноду тега без пропсов", () => {
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

  it("должен добавить атрибуты", () => {
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

  it("должен вызвать перебор children", () => {
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

describe("insert", () => {
  let NODE = {};

  beforeEach(() => {
    vi.clearAllMocks();

    NODE = BASE_NODE;
  });

  it("должен добавлять элемент в конец, если индекс не указан", () => {
    const el = { ...NODE };
    const parentEl = { ...NODE, childNodes: [] };

    insert(el, parentEl);

    expect(parentEl.append).toHaveBeenCalledWith(el);
    expect(parentEl.insertBefore).not.toHaveBeenCalled();
  });

  it("должен выбрасывать ошибку, если индекс отрицательный", () => {
    const el = { ...NODE };
    const parentEl = { ...NODE, childNodes: [] };

    expect(() => insert(el, parentEl, -1)).toThrow("Index must be a positive");
  });

  it("должен добавлять элемент в конец, если индекс больше длины childNodes", () => {
    const el = { ...NODE };
    const parentEl = { ...NODE, childNodes: [{}] };

    insert(el, parentEl, 10);

    expect(parentEl.append).toHaveBeenCalledWith(el);
    expect(parentEl.insertBefore).not.toHaveBeenCalled();
  });

  it("должен вставлять элемент перед указанным индексом", () => {
    const el = { ...NODE };
    const parentEl = { ...NODE, childNodes: [{}, {}, {}] };

    insert(el, parentEl, 1);

    expect(parentEl.insertBefore).toHaveBeenCalledWith(
      el,
      parentEl.childNodes[1]
    );
    expect(parentEl.append).not.toHaveBeenCalled();
  });
});
