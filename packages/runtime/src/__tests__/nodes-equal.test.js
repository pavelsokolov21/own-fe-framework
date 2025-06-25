import { describe, test, expect } from "vitest";
import { areNodesEqual } from "../nodes-equal";
import { DOM_TYPES } from "../h";

describe("Функция areNodesEqual", () => {
  test("должен возвращать false, если типы узлов не совпадают", () => {
    const node1 = { type: DOM_TYPES.ELEMENT, tag: "div" };
    const node2 = { type: DOM_TYPES.TEXT, tag: "span" };
    const result = areNodesEqual(node1, node2);

    expect(result).toBe(false);
  });

  test("должен возвращать true, если типы узлов TEXT совпадают", () => {
    const node1 = { type: DOM_TYPES.TEXT };
    const node2 = { type: DOM_TYPES.TEXT };
    const result = areNodesEqual(node1, node2);

    expect(result).toBe(true);
  });

  test("должен возвращать true, если типы и теги узлов ELEMENT совпадают", () => {
    const node1 = { type: DOM_TYPES.ELEMENT, tag: "div" };
    const node2 = { type: DOM_TYPES.ELEMENT, tag: "div" };
    const result = areNodesEqual(node1, node2);

    expect(result).toBe(true);
  });

  test("должен возвращать false, если теги узлов ELEMENT не совпадают", () => {
    const node1 = { type: DOM_TYPES.ELEMENT, tag: "div" };
    const node2 = { type: DOM_TYPES.ELEMENT, tag: "span" };
    const result = areNodesEqual(node1, node2);

    expect(result).toBe(false);
  });
});
