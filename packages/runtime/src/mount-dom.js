import { setAttributes } from "./attributes";
import { addEventListeners } from "./events";
import { DOM_TYPES } from "./h";

export const insert = (el, parentEl, index) => {
  if (index == null) {
    parentEl.append(el);

    return;
  }

  if (index < 0) {
    throw new Error("Index must be a positive");
  }

  const children = parentEl.childNodes;

  if (index >= children.length) {
    parentEl.append(el);
  } else {
    parentEl.insertBefore(el, children[index]);
  }
};

export function mountDOM(vdom, parentEl, index) {
  switch (vdom.type) {
    case DOM_TYPES.TEXT:
      createTextNode(vdom, parentEl, index);
      break;
    case DOM_TYPES.ELEMENT:
      createElementNode(vdom, parentEl, index);
      break;
    case DOM_TYPES.FRAGMENT:
      createFragmentNodes(vdom, parentEl, index);
      break;
    default:
      throw new Error(`Type "${vdom.type}" is unknown`);
  }
}

function createTextNode(vdom, parentEl, index) {
  const textNode = document.createTextNode(vdom.value);

  vdom.el = textNode;

  insert(textNode, parentEl, index);
}

function createElementNode(vdom, parentEl, index) {
  const { tag, props, children } = vdom;

  const el = document.createElement(tag);
  addProps(el, props, vdom);
  vdom.el = el;

  children.forEach((child) => {
    mountDOM(child, el);
  });

  insert(el, parentEl, index);
}

function createFragmentNodes(vdom, parentEl, index) {
  vdom.el = parentEl;

  vdom.children.forEach((child, i) => {
    mountDOM(child, parentEl, index ? index + i : null);
  });
}

function addProps(el, props, vdom) {
  const { on: events, ...attrs } = props;

  vdom.listeners = addEventListeners(el, events);
  setAttributes(el, attrs);
}
