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

export function mountDOM(vdom, parentEl, index, hostComponent = null) {
  switch (vdom.type) {
    case DOM_TYPES.TEXT:
      createTextNode(vdom, parentEl, index);
      break;
    case DOM_TYPES.ELEMENT:
      createElementNode(vdom, parentEl, index, hostComponent);
      break;
    case DOM_TYPES.FRAGMENT:
      createFragmentNodes(vdom, parentEl, index, hostComponent);
      break;
    case DOM_TYPES.COMPONENT: {
      createComponentNode(vdom, parentEl, index, hostComponent);
      break;
    }
    default:
      throw new Error(`Type "${vdom.type}" is unknown`);
  }
}

function createComponentNode(vdom, parentEl, index, hostComponent) {
  const Component = vdom.tag;
  const props = vdom.props;
  const component = new Component(props);

  component.mount(parentEl, index);
  vdom.component = component;
  vdom.el = component.firstElement;
}

function createTextNode(vdom, parentEl, index) {
  const textNode = document.createTextNode(vdom.value);

  vdom.el = textNode;

  insert(textNode, parentEl, index);
}

function createElementNode(vdom, parentEl, index, hostComponent) {
  const { tag, props, children } = vdom;

  const el = document.createElement(tag);
  addProps(el, props, vdom, hostComponent);
  vdom.el = el;

  children.forEach((child) => {
    mountDOM(child, el);
  });

  insert(el, parentEl, index);
}

function createFragmentNodes(vdom, parentEl, index, hostComponent) {
  vdom.el = parentEl;

  vdom.children.forEach((child, i) => {
    mountDOM(child, parentEl, index ? index + i : null, hostComponent);
  });
}

function addProps(el, props, vdom, hostComponent) {
  const { on: events, ...attrs } = props;

  vdom.listeners = addEventListeners(el, events, hostComponent);
  setAttributes(el, attrs);
}
