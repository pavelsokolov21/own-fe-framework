export const addEventListener = (eventName, handler, el) => {
  function boundHandler(e) {
    handler(e);
  }

  el.addEventListener(eventName, boundHandler);

  return boundHandler;
};

export const addEventListeners = (el, listeners = {}) => {
  return Object.entries(listeners).reduce((acc, [eventName, handler]) => {
    acc[eventName] = addEventListener(eventName, handler, el);

    return acc;
  }, {});
};

export function removeEventListeners(el, listeners = {}) {
  Object.entries(listeners).forEach(([eventName, handler]) => {
    el.removeEventListener(eventName, handler);
  });
}
