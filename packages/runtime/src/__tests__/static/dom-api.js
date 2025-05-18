import { vi } from "vitest";

export const BASE_NODE = {
  classList: {
    add: vi.fn(),
  },
  removeAttribute: vi.fn(),
  setAttribute: vi.fn(),
  append: vi.fn(),
  remove: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  style: {},
};
