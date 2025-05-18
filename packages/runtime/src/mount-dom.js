import { setAttributes } from "./attributes";
import { addEventListeners } from "./events";
import { DOM_TYPES } from "./h";

export function mountDOM(vdom, parentEl) {
  switch (vdom.type) {
    case DOM_TYPES.TEXT:
      createTextNode(vdom, parentEl);
      break;
    case DOM_TYPES.ELEMENT:
      createElementNode(vdom, parentEl);
      break;
    case DOM_TYPES.FRAGMENT:
      createFragmentNode(vdom, parentEl);
      break;
    default:
      throw new Error(`Type "${vdom.type}" is unknown`);
  }
}

function createTextNode(vdom, parentEl) {
  const textNode = document.createTextNode(vdom.value);

  vdom.el = textNode;

  parentEl.append(textNode);
}

function createElementNode(vdom, parentEl) {
  const { tag, props, children } = vdom;

  const el = document.createElement(tag);
  addProps(el, props, vdom);
  vdom.el = el;

  children.forEach((child) => {
    mountDOM(child, el);
  });

  parentEl.append(el);
}

function addProps(el, props, vdom) {
  const { on: events, ...attrs } = props;

  vdom.listeners = addEventListeners(el, events);
  setAttributes(el, attrs);
}

function createFragmentNode(vdom, parentEl) {
  vdom.el = parentEl;

  vdom.children.forEach((child) => {
    mountDOM(child, parentEl);
  });
}
