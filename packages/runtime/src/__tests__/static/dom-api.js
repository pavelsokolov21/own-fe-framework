import { vi } from "vitest";

const classListAddMock = vi.fn();
const removeAttributeMock = vi.fn();
const setAttributeMock = vi.fn();
const documentAppendMock = vi.fn();
const addEventListenerMock = vi.fn();

export const BASE_NODE = {
  classList: {
    add: classListAddMock,
  },
  removeAttribute: removeAttributeMock,
  setAttribute: setAttributeMock,
  append: documentAppendMock,
  addEventListener: addEventListenerMock,
  style: {},
};
