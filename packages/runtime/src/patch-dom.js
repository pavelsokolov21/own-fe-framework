import { areNodesEqual } from "./nodes-equal";
import { destroyDOM } from "./destroy-dom";
import { mountDOM } from "./mount-dom";
import { DOM_TYPES, extractChildren } from "./h";
import { objectsDiff } from "./utils/objects";
import {
  removeAttribute,
  removeStyle,
  setAttribute,
  setStyle,
} from "./attributes";
import { isNotBlankOrEmptyString } from "./utils/strings";
import { ARRAY_DIFF_OP, arraysDiff, arraysDiffSequence } from "./utils/arrays";
import { addEventListener } from "./events";
import { extractPropsAndEvents } from "./utils/props";

const findIndexInParent = (parentEl, el) => {
  const idx = Array.from(parentEl.childNodes).indexOf(el);

  return idx === -1 ? null : idx;
};

const toClassList = (classes = "") => {
  return Array.isArray(classes)
    ? classes.filter((s) => isNotBlankOrEmptyString(s))
    : classes.split(/(\s+)/).filter((s) => isNotBlankOrEmptyString(s));
};

const patchText = (oldVdom, newVdom) => {
  if (oldVdom.value !== newVdom.value) {
    oldVdom.el.nodeValue = newVdom.value;
  }
};

const patchAttrs = (el, oldAttrs, newAttrs) => {
  const { added, removed, updated } = objectsDiff(oldAttrs, newAttrs);

  removed.forEach((attr) => {
    removeAttribute(el, attr);
  });

  added.concat(updated).forEach((attr) => {
    setAttribute(el, attr, newAttrs[attr]);
  });
};

const patchClasses = (el, oldClass, newClass) => {
  const oldClasses = toClassList(oldClass);
  const newClasses = toClassList(newClass);

  const { added, removed } = arraysDiff(oldClasses, newClasses);

  if (removed.length > 0) {
    el.classList.remove(...removed);
  }

  if (added.length > 0) {
    el.classList.add(...added);
  }
};

const patchStyles = (el, oldStyle = {}, newStyle = {}) => {
  const { added, removed, updated } = objectsDiff(oldStyle, newStyle);

  removed.forEach((style) => {
    removeStyle(el, style);
  });

  added.concat(updated).forEach((style) => {
    setStyle(el, style, newStyle[style]);
  });
};

const patchEvents = (
  el,
  oldListeners = {},
  oldEvents = {},
  newEvents = {},
  hostComponent
) => {
  const { added, removed, updated } = objectsDiff(oldEvents, newEvents);

  removed.concat(updated).forEach((eventName) => {
    el.removeEventListener(eventName, oldListeners[eventName]);
  });

  return added.concat(updated).reduce((acc, eventName) => {
    acc[eventName] = addEventListener(
      eventName,
      newEvents[eventName],
      el,
      hostComponent
    );

    return acc;
  }, {});
};

const patchElement = (oldVdom, newVdom, hostComponent) => {
  const el = oldVdom.el;
  const {
    class: oldClass,
    style: oldStyle,
    on: oldEvents,
    ...oldAttrs
  } = oldVdom.props;
  const {
    class: newClass,
    style: newStyle,
    on: newEvents,
    ...newAttrs
  } = newVdom.props;
  const { listeners: oldListeners } = oldVdom;

  patchAttrs(el, oldAttrs, newAttrs);
  patchClasses(el, oldClass, newClass);
  patchStyles(el, oldStyle, newStyle);
  newVdom.listeners = patchEvents(
    el,
    oldListeners,
    oldEvents,
    newEvents,
    hostComponent
  );
};

const patchChildren = (oldVdom, newVdom, hostComponent) => {
  const oldChildren = extractChildren(oldVdom);
  const newChildren = extractChildren(newVdom);
  const parentEl = oldVdom.el;

  const diffSeq = arraysDiffSequence(oldChildren, newChildren, areNodesEqual);

  diffSeq.forEach((operation) => {
    const { originalIndex, index, item, op } = operation;
    const offset = hostComponent?.offset ?? 0;

    switch (op) {
      case ARRAY_DIFF_OP.ADD: {
        mountDOM(item, parentEl, index + offset);

        break;
      }
      case ARRAY_DIFF_OP.REMOVE: {
        destroyDOM(item);

        break;
      }
      case ARRAY_DIFF_OP.MOVE: {
        const oldChild = oldChildren[originalIndex];
        const newChild = newChildren[index];
        const el = oldChild.el;
        const elAtTargetIndex = parentEl.childNodes[index + offset];

        parentEl.insertBefore(el, elAtTargetIndex);
        patchDOM(oldChild, newChild, parentEl, hostComponent);

        break;
      }
      case ARRAY_DIFF_OP.NOOP: {
        patchDOM(
          oldChildren[originalIndex],
          newChildren[index],
          parentEl,
          hostComponent
        );

        break;
      }
    }
  });
};

const patchComponent = (oldVdom, newVdom) => {
  const { component } = oldVdom;
  const { children } = newVdom;
  const { props } = extractPropsAndEvents(newVdom);

  component.setExternalContent(children);
  component.updateProps(props);
  newVdom.component = component;
  newVdom.el = component.firstElement;
};

export const patchDOM = (oldVdom, newVdom, parentEl, hostComponent = null) => {
  if (!areNodesEqual(oldVdom, newVdom)) {
    const idx = findIndexInParent(parentEl, oldVdom.el);

    destroyDOM(oldVdom);
    mountDOM(newVdom, parentEl, idx, hostComponent);

    return newVdom;
  }

  newVdom.el = oldVdom.el;

  switch (newVdom.type) {
    case DOM_TYPES.TEXT: {
      patchText(oldVdom, newVdom);
      return newVdom;
    }
    case DOM_TYPES.ELEMENT:
      patchElement(oldVdom, newVdom, hostComponent);
      break;
    case DOM_TYPES.COMPONENT:
      patchComponent(oldVdom, newVdom);
      break;
  }

  patchChildren(oldVdom, newVdom, hostComponent);

  return newVdom;
};
