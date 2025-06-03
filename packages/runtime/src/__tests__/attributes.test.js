import { beforeEach, describe, expect, test, vi } from "vitest";

import { setAttributes } from "../attributes";
import { BASE_NODE } from "./static/dom-api";

describe("Функция setAttributes", () => {
  let NODE = {};

  beforeEach(() => {
    vi.clearAllMocks();

    NODE = BASE_NODE;
  });

  test("должен установить className через строку", () => {
    const attrs = { class: "className" };
    setAttributes(NODE, attrs);

    expect(NODE.className).toBe(attrs.class);
  });

  test("должен установить className через массив", () => {
    const classNames = ["foo", "bar"];
    const attrs = { class: classNames };
    setAttributes(NODE, attrs);

    expect(BASE_NODE.classList.add).toHaveBeenCalledWith(
      classNames[0],
      classNames[1]
    );
  });

  test("должен установить style", () => {
    const attrs = { style: { color: "red", fontSize: "14px" } };
    setAttributes(NODE, attrs);

    expect(NODE.style).toEqual({ color: "red", fontSize: "14px" });
  });

  test("должен установить атрибуты", () => {
    const attrs = {
      id: "foo",
      href: "http://sample.com",
      "data-foo": "datafoo",
    };
    setAttributes(NODE, attrs);

    expect(NODE.setAttribute).toHaveBeenCalledWith("id", attrs.id);
    expect(NODE.setAttribute).toHaveBeenCalledWith("href", attrs.href);
    expect(NODE.setAttribute).toHaveBeenCalledWith(
      "data-foo",
      attrs["data-foo"]
    );
  });

  test("должен удалить атрибут", () => {
    const attrs = { id: "foo", href: "http://sample.com" };
    setAttributes(NODE, attrs);
    setAttributes(NODE, { ...attrs, id: null });

    expect(NODE.removeAttribute).toHaveBeenCalledWith("id");
  });

  test("должен добавить булевый атрибут", () => {
    const attrs = { disabled: true };
    setAttributes(NODE, attrs);

    expect(NODE.disabled).toBe(true);
  });
});
