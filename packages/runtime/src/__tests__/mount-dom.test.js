import { beforeEach, describe, expect, test, vi } from "vitest";
import { DOM_TYPES } from "../h";
import { mountDOM } from "../mount-dom";

const TEXT_NODE_RESULT = "textNode";

const documentAppend = vi.fn();

const parentNodeMock = {
  append: documentAppend,
};

const documentCreateElementMock = vi.fn();
const documentCreateTextNodeMock = vi.fn(() => TEXT_NODE_RESULT);

vi.stubGlobal("document", {
  createElement: documentCreateElementMock,
  createTextNode: documentCreateTextNodeMock,
});

describe("Функция mountDOM", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("должен создать текстовую ноду", () => {
    const V_DOM = { type: DOM_TYPES.TEXT, value: "lorem" };
    mountDOM(V_DOM, parentNodeMock);

    expect(documentCreateTextNodeMock).toHaveBeenCalledWith(V_DOM.value);
    expect(documentAppend).toHaveBeenCalledWith(TEXT_NODE_RESULT);
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
    mountDOM(V_DOM, parentNodeMock);

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
    const NODE_RESULT = { tag: V_DOM.tag, append: documentAppend };

    documentCreateElementMock.mockReturnValueOnce(NODE_RESULT);

    mountDOM(V_DOM, parentNodeMock);

    expect(documentCreateElementMock).toHaveBeenCalledWith(V_DOM.tag);
    expect(V_DOM.el).toEqual(NODE_RESULT);
    expect(documentAppend).toHaveBeenCalledWith(
      expect.objectContaining(NODE_RESULT)
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
    const NODE_RESULT = { tag: V_DOM.tag, append: documentAppend };

    documentCreateElementMock.mockReturnValueOnce(NODE_RESULT);

    mountDOM(V_DOM, parentNodeMock);

    expect(forEachSpy).toHaveBeenCalled();
  });
});
