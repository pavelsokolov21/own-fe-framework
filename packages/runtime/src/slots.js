import { DOM_TYPES, hFragment } from "./h";
import { traverseDFS } from "./traverse-dom";

const shouldSkipBranch = (node) => {
  return node.type === DOM_TYPES.COMPONENT;
};

export const insertViewInSlot = (node, parent, index, externalContent) => {
  if (node.type !== DOM_TYPES.SLOT) return;

  const defaultContent = node.children;
  const views = externalContent.length > 0 ? externalContent : defaultContent;

  parent.children.splice(
    index,
    1,
    views.length > 0 ? hFragment(views) : undefined
  );
};

export const fillSlots = (vdom, externalContent = []) => {
  function processNode(node, parent, index) {
    insertViewInSlot(node, parent, index, externalContent);
  }

  traverseDFS(vdom, processNode, shouldSkipBranch);
};
