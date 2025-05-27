import { beforeEach, describe, expect, it, vi } from "vitest";
import { Dispatcher } from "../dispatcher";

describe("Класс Dispatcher", () => {
  let dispatcher = new Dispatcher();

  beforeEach(() => {
    dispatcher = new Dispatcher();
  });

  it("должен вызвать все добавленные хендлеры по одной команде", () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const PAYLOAD = {
      value: "foo",
    };
    const COMMAND = "command";

    dispatcher.subscribe(COMMAND, handler1);
    dispatcher.subscribe(COMMAND, handler2);

    dispatcher.dispatch(COMMAND, PAYLOAD);

    expect(handler1).toHaveBeenCalledWith(expect.objectContaining(PAYLOAD));
    expect(handler2).toHaveBeenCalledWith(expect.objectContaining(PAYLOAD));
  });

  it("не должен добавить дублирующий хендлер и отписать его", () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const PAYLOAD = {
      value: "foo",
    };
    const COMMAND = "command";

    dispatcher.subscribe(COMMAND, handler1);
    dispatcher.subscribe(COMMAND, handler2);
    const duplicatedUnsub = dispatcher.subscribe(COMMAND, handler2);

    duplicatedUnsub();

    dispatcher.dispatch(COMMAND, PAYLOAD);

    expect(handler1).toHaveBeenCalled();
    expect(handler2).toHaveBeenCalled();
  });

  it("должен вызвать все добавленные хендлеры по двум командам", () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const PAYLOAD_1 = {
      value: "foo",
    };
    const PAYLOAD_2 = {
      value: "bar",
    };
    const COMMAND_1 = "command-1";
    const COMMAND_2 = "command-2";

    dispatcher.subscribe(COMMAND_1, handler1);
    dispatcher.subscribe(COMMAND_2, handler2);

    dispatcher.dispatch(COMMAND_1, PAYLOAD_1);
    dispatcher.dispatch(COMMAND_2, PAYLOAD_2);

    expect(handler1).toHaveBeenCalledWith(expect.objectContaining(PAYLOAD_1));
    expect(handler2).toHaveBeenCalledWith(expect.objectContaining(PAYLOAD_2));
  });

  it("должен вызвать только одну функцию после отписки второй", () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const PAYLOAD = {
      value: "foo",
    };
    const COMMAND = "command";

    dispatcher.subscribe(COMMAND, handler1);
    const unsub2 = dispatcher.subscribe(COMMAND, handler2);

    unsub2();

    dispatcher.dispatch(COMMAND, PAYLOAD);

    expect(handler1).toHaveBeenCalled();
    expect(handler2).not.toHaveBeenCalled();
  });

  it("должен вызвать афтер-хендлер", () => {
    const handler = vi.fn();
    const afterHandler = vi.fn();
    const PAYLOAD = {
      value: "foo",
    };
    const COMMAND = "command";

    dispatcher.subscribe(COMMAND, handler);
    dispatcher.afterEveryCommand(afterHandler);

    dispatcher.dispatch(COMMAND, PAYLOAD);

    expect(afterHandler).toHaveBeenCalled();
  });

  it("должен вызвать 2 афтер-хендлера", () => {
    const handler = vi.fn();
    const afterHandler1 = vi.fn();
    const afterHandler2 = vi.fn();
    const PAYLOAD = {
      value: "foo",
    };
    const COMMAND = "command";

    dispatcher.subscribe(COMMAND, handler);
    dispatcher.afterEveryCommand(afterHandler1);
    dispatcher.afterEveryCommand(afterHandler2);

    dispatcher.dispatch(COMMAND, PAYLOAD);

    expect(afterHandler1).toHaveBeenCalled();
    expect(afterHandler2).toHaveBeenCalled();
  });

  it("не должен вызвать афтер-хендлер после отписки", () => {
    const handler = vi.fn();
    const afterHandler = vi.fn();
    const PAYLOAD = {
      value: "foo",
    };
    const COMMAND = "command";

    dispatcher.subscribe(COMMAND, handler);
    const unsubAfterHandler = dispatcher.afterEveryCommand(afterHandler);

    unsubAfterHandler();

    dispatcher.dispatch(COMMAND, PAYLOAD);

    expect(afterHandler).not.toHaveBeenCalled();
  });
});
