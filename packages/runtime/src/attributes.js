export const setAttributes = (el, attrs) => {
  const { class: className, style, ...restAttrs } = attrs;

  if (className) {
    setClass(el, className);
  }

  if (style) {
    Object.entries(style).forEach(([key, value]) => {
      setStyle(el, key, value);
    });
  }

  Object.entries(restAttrs).forEach(([key, value]) => {
    setAttribute(el, key, value);
  });
};

export function setClass(el, className) {
  el.className = "";

  if (typeof className === "string") {
    el.className = className;
  }

  if (Array.isArray(className)) {
    el.classList.add(...className);
  }
}

export function setStyle(el, name, value) {
  el.style[name] = value;
}

export function removeStyle(el, name) {
  el.style[name] = null;
}

export function setAttribute(el, name, value) {
  if (value === null) {
    removeAttribute(el, name);
  } else if (typeof value === "boolean") {
    el[name] = value;
  } else {
    el.setAttribute(name, value);
  }
}

export function removeAttribute(el, name) {
  el[name] = null;
  el.removeAttribute(name);
}
