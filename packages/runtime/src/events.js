export const addEventListener = (
  eventName,
  handler,
  el,
  hostComponent = null
) => {
  function boundHandler(...args) {
    hostComponent ? handler.apply(hostComponent, args) : handler(...args);
  }

  el.addEventListener(eventName, boundHandler);

  return boundHandler;
};

export const addEventListeners = (el, listeners = {}, hostComponent = null) => {
  return Object.entries(listeners).reduce((acc, [eventName, handler]) => {
    acc[eventName] = addEventListener(eventName, handler, el, hostComponent);

    return acc;
  }, {});
};

export function removeEventListeners(el, listeners = {}) {
  Object.entries(listeners).forEach(([eventName, handler]) => {
    el.removeEventListener(eventName, handler);
  });
}
