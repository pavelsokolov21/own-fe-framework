import { DOM_TYPES } from "./h";

export const areNodesEqual = (node1, node2) => {
  if (node1.type !== node2.type) {
    return false;
  }

  if (node1.type === DOM_TYPES.ELEMENT) {
    return node1.tag === node2.tag && node1.props.key === node2.props.key;
  }

  if (node1.type === DOM_TYPES.COMPONENT) {
    return node1.tag === node2.tag && node1.props.key === node2.props.key;
  }

  return true;
};
