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

  const newClassName = Array.isArray(className)
    ? className.join(" ")
    : className;

  el.classList.add(newClassName);
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
  } else {
    el.setAttribute(name, value);
  }
}

export function removeAttribute(el, name) {
  el[name] = null;
  el.removeAttribute(name);
}
