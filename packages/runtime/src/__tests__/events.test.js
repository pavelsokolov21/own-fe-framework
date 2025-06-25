import { beforeEach, describe, expect, it, vi } from "vitest";

import { addEventListeners, removeEventListeners } from "../events";

describe("Функция addEventListeners", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("должен привязать обработчики вернуть объект обработчиков", () => {
    const clickHandler = vi.fn();
    const changeHandler = vi.fn();
    const addEventListenerMock = vi.fn();

    addEventListeners(
      { addEventListener: addEventListenerMock },
      {
        click: clickHandler,
        change: changeHandler,
      }
    );

    expect(addEventListenerMock).toHaveBeenCalledTimes(2);
  });
});

describe("Функция removeEventListeners", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("должен отвязать обработчики от элемента", () => {
    const clickHandler = vi.fn();
    const removeEventListenerMock = vi.fn();

    removeEventListeners(
      { removeEventListener: removeEventListenerMock },
      { click: clickHandler }
    );

    expect(removeEventListenerMock).toHaveBeenCalledWith("click", clickHandler);
  });
});
