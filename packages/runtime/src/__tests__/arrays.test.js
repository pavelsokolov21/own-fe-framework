import {
  arraysDiff,
  ArrayWithOriginalIndices,
  ARRAY_DIFF_OP,
  arraysDiffSequence,
} from "../utils/arrays";

import { describe, expect, it } from "vitest";

const createBaseReturn = (added = [], removed = []) => ({
  added,
  removed,
});

describe("Функция arraysDiff", () => {
  it("должен вернуть объект с заполненным списком удаленных элементов", () => {
    const result = arraysDiff(["a", "b"], ["a"]);

    expect(result).toEqual(createBaseReturn([], ["b"]));
  });

  it("должен вернуть объект с заполненным списком добавленных элементов", () => {
    const result = arraysDiff(["a"], ["a", "b"]);

    expect(result).toEqual(createBaseReturn(["b"], []));
  });
});

describe("Класс ArrayWithOriginalIndices", () => {
  it("должен корректно находить оригинальный индекс", () => {
    const arr = new ArrayWithOriginalIndices([1, 2, 3], (a, b) => a === b);

    expect(arr.originalIndexAt(0)).toBe(0);
    expect(arr.originalIndexAt(1)).toBe(1);
    expect(arr.originalIndexAt(2)).toBe(2);
  });

  it("должен находить индекс элемента начиная с заданного индекса", () => {
    const arr = new ArrayWithOriginalIndices([1, 2, 3], (a, b) => a === b);

    expect(arr.findIndexFrom(2, 0)).toBe(1);
    expect(arr.findIndexFrom(3, 1)).toBe(2);
    expect(arr.findIndexFrom(4, 0)).toBe(-1);
  });

  it("должен проверять, является ли элемент удалённым", () => {
    const arr = new ArrayWithOriginalIndices([1, 2, 3], (a, b) => a === b);

    expect(arr.isRemoval(1, [1, 3])).toBe(true);
    expect(arr.isRemoval(0, [1, 2, 3])).toBe(false);
  });

  it("должен проверять, является ли элемент неизменным", () => {
    const arr = new ArrayWithOriginalIndices([1, 2, 3], (a, b) => a === b);

    expect(arr.isNoop(0, [1, 2, 3])).toBe(true);
    expect(arr.isNoop(1, [1, 3, 2])).toBe(false);
  });

  it("должен проверять, является ли элемент дополнительным", () => {
    const arr = new ArrayWithOriginalIndices([1, 2, 3], (a, b) => a === b);

    expect(arr.isAdditional(4, 0)).toBe(true);
    expect(arr.isAdditional(2, 0)).toBe(false);
  });

  it("должен удалять элемент и возвращать операцию", () => {
    const arr = new ArrayWithOriginalIndices([1, 2, 3], (a, b) => a === b);
    const operation = arr.removeItem(1);

    expect(operation).toEqual({ op: ARRAY_DIFF_OP.REMOVE, index: 1, item: 2 });
    expect(arr.length).toBe(2);
  });

  it("должен добавлять элемент и возвращать операцию", () => {
    const arr = new ArrayWithOriginalIndices([1, 3], (a, b) => a === b);
    const operation = arr.addItem(2, 1);

    expect(operation).toEqual({ op: ARRAY_DIFF_OP.ADD, index: 1, item: 2 });
    expect(arr.length).toBe(3);
  });

  it("должен перемещать элемент и возвращать операцию", () => {
    const arr = new ArrayWithOriginalIndices([1, 2, 3], (a, b) => a === b);
    const operation = arr.moveItem(2, 0);

    expect(operation).toEqual({
      op: ARRAY_DIFF_OP.MOVE,
      originalIndex: 1,
      from: 1,
      index: 0,
      item: 2,
    });
    expect(arr.originalIndexAt(0)).toBe(1);
    expect(arr.originalIndexAt(1)).toBe(0);
  });
});

describe("Функция arraysDiffSequence", () => {
  it("должен возвращать пустую последовательность для одинаковых массивов", () => {
    const oldArr = [1, 2, 3];
    const newArr = [1, 2, 3];
    const result = arraysDiffSequence(oldArr, newArr);

    expect(result).toEqual([
      { op: ARRAY_DIFF_OP.NOOP, originalIndex: 0, index: 0, item: 1 },
      { op: ARRAY_DIFF_OP.NOOP, originalIndex: 1, index: 1, item: 2 },
      { op: ARRAY_DIFF_OP.NOOP, originalIndex: 2, index: 2, item: 3 },
    ]);
  });

  it("должен корректно обрабатывать удаление элемента", () => {
    const oldArr = [1, 2, 3];
    const newArr = [1, 3];
    const result = arraysDiffSequence(oldArr, newArr);

    expect(result).toEqual([
      { op: ARRAY_DIFF_OP.NOOP, originalIndex: 0, index: 0, item: 1 },
      { op: ARRAY_DIFF_OP.REMOVE, index: 1, item: 2 },
      { op: ARRAY_DIFF_OP.NOOP, originalIndex: 2, index: 1, item: 3 },
    ]);
  });

  it("должен корректно обрабатывать добавление элемента", () => {
    const oldArr = [1, 3];
    const newArr = [1, 2, 3];
    const result = arraysDiffSequence(oldArr, newArr);

    expect(result).toEqual([
      { op: ARRAY_DIFF_OP.NOOP, originalIndex: 0, index: 0, item: 1 },
      { op: ARRAY_DIFF_OP.ADD, index: 1, item: 2 },
      { op: ARRAY_DIFF_OP.NOOP, originalIndex: 1, index: 2, item: 3 },
    ]);
  });

  it("должен корректно обрабатывать перемещение элемента", () => {
    const oldArr = [1, 2, 3];
    const newArr = [3, 1, 2];
    const result = arraysDiffSequence(oldArr, newArr);

    expect(result).toEqual([
      { op: ARRAY_DIFF_OP.MOVE, originalIndex: 2, from: 2, index: 0, item: 3 },
      { op: ARRAY_DIFF_OP.MOVE, originalIndex: 0, from: 2, index: 1, item: 1 },
      { op: ARRAY_DIFF_OP.NOOP, originalIndex: 1, index: 2, item: 2 },
    ]);
  });

  it("должен обрабатывать смешанные операции добавления, удаления и перемещения", () => {
    const oldArr = [1, 2, 3, 4];
    const newArr = [3, 1, 5];
    const result = arraysDiffSequence(oldArr, newArr);

    expect(result).toEqual([
      { op: ARRAY_DIFF_OP.MOVE, originalIndex: 2, from: 2, index: 0, item: 3 },
      { op: ARRAY_DIFF_OP.REMOVE, index: 1, item: 2 },
      { op: ARRAY_DIFF_OP.NOOP, originalIndex: 0, index: 1, item: 1 },
      { op: ARRAY_DIFF_OP.REMOVE, index: 2, item: 4 },
      { op: ARRAY_DIFF_OP.ADD, index: 2, item: 5 },
    ]);
  });

  it("должен обрабатывать случай, когда все элементы удалены", () => {
    const oldArr = [1, 2, 3];
    const newArr = [];
    const result = arraysDiffSequence(oldArr, newArr);

    expect(result).toEqual([
      { op: ARRAY_DIFF_OP.REMOVE, index: 0, item: 1 },
      { op: ARRAY_DIFF_OP.REMOVE, index: 0, item: 2 },
      { op: ARRAY_DIFF_OP.REMOVE, index: 0, item: 3 },
    ]);
  });

  it("должен обрабатывать случай, когда все элементы добавлены", () => {
    const oldArr = [];
    const newArr = [1, 2, 3];
    const result = arraysDiffSequence(oldArr, newArr);

    expect(result).toEqual([
      { op: ARRAY_DIFF_OP.ADD, index: 0, item: 1 },
      { op: ARRAY_DIFF_OP.ADD, index: 1, item: 2 },
      { op: ARRAY_DIFF_OP.ADD, index: 2, item: 3 },
    ]);
  });
});
