import { beforeEach, describe, expect, test, vi } from "vitest";

import {
  addEventListener,
  addEventListeners,
  removeEventListeners,
} from "../events";

describe("Функция addEventListener", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("должен привязать обработчик и вернуть функцию", () => {
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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("должен привязать обработчики вернуть объект обработчиков", () => {
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

describe("Функция removeEventListeners", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("должен отвязать обработчики от элемента", () => {
    const clickHandler = vi.fn();
    const removeEVentListenerMock = vi.fn();

    removeEventListeners(
      { removeEventListener: removeEVentListenerMock },
      { click: clickHandler }
    );

    expect(removeEVentListenerMock).toHaveBeenCalledWith("click", clickHandler);
  });
});
