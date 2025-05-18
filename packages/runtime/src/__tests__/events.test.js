import { describe, expect, test, vi } from "vitest";

import { addEventListener, addEventListeners } from "../events";

describe("Функция addEventListener", () => {
  test("должна привязать обработчик и вернуть функцию", () => {
    const handler = vi.fn();
    const EVENT_NAME = "click";
    const addEventListenerMock = vi.fn();

    const resultHandler = addEventListener(EVENT_NAME, handler, {
      addEventListener: addEventListenerMock,
    });

    expect(addEventListenerMock).toHaveBeenCalledWith(EVENT_NAME, handler);
    expect(resultHandler).toEqual(handler);
  });
});

describe("Функция addEventListeners", () => {
  test("должна привязать обработчики вернуть объект обработчиков", () => {
    const clickHandler = vi.fn();
    const changeHandler = vi.fn();
    const addEventListenerMock = vi.fn();

    const result = addEventListeners(
      { addEventListener: addEventListenerMock },
      {
        click: clickHandler,
        change: changeHandler,
      }
    );

    expect(addEventListenerMock).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      click: clickHandler,
      change: changeHandler,
    });
  });
});
