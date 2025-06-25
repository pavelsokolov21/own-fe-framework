import { objectsDiff } from "../utils/objects";

import { describe, expect, it } from "vitest";

const createBaseReturn = (added = [], removed = [], updated = []) => ({
  added,
  removed,
  updated,
});

describe("Функция objectsDiff", () => {
  it("должен вернуть объект с заполненным списком удаленных ключей атрибутов", () => {
    const result = objectsDiff({ type: "a" }, {});

    expect(result).toEqual(createBaseReturn([], ["type"], []));
  });

  it("должен вернуть объект с заполненным списком добавленных атрибутов", () => {
    const result = objectsDiff({}, { type: "a" });

    expect(result).toEqual(createBaseReturn(["type"], [], []));
  });

  it("должен вернуть объект с заполненным списком обновленных атрибутов", () => {
    const result = objectsDiff({ type: "a" }, { type: "b" });

    expect(result).toEqual(createBaseReturn([], [], ["type"]));
  });

  it("должен вернуть объект с пустыми элементами массивами, если объекты схожи", () => {
    const result = objectsDiff({ type: "a" }, { type: "a" });

    expect(result).toEqual(createBaseReturn([], [], []));
  });
});
