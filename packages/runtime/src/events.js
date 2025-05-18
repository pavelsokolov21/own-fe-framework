export const addEventListener = (eventName, handler, el) => {
  el.addEventListener(eventName, handler);

  return handler;
};

export const addEventListeners = (el, listeners = {}) => {
  return Object.entries(listeners).reduce((acc, [eventName, handler]) => {
    acc[eventName] = addEventListener(eventName, handler, el);

    return acc;
  }, {});
};
