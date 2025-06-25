import { withoutNullish } from "./utils/arrays";

export const DOM_TYPES = {
  TEXT: "text",
  ELEMENT: "element",
  FRAGMENT: "fragment",
};

export function hString(txt) {
  return { type: DOM_TYPES.TEXT, value: txt };
}

export function hFragment(children) {
  return {
    type: DOM_TYPES.FRAGMENT,
    children: mapTextNodes(withoutNullish(children)),
  };
}

function mapTextNodes(children) {
  return children.map((child) => {
    return typeof child === "string" ? hString(child) : child;
  });
}

export const h = (tag, props = {}, children = []) => {
  return {
    tag,
    props,
    children: mapTextNodes(withoutNullish(children)),
    type: DOM_TYPES.ELEMENT,
  };
};

export const extractChildren = (vdom) => {
  if (vdom.children === null) {
    return [];
  }

  return vdom.children.flatMap((child) => {
    return child.type === DOM_TYPES.FRAGMENT ? extractChildren(child) : child;
  });
};
