// @flow

export default function getStyle(
  node: HTMLElement,
  prop: String,
  pseudo: ':after' | ':before' = null,
) {
  if (typeof window.getComputedStyle !== 'function') {
    throw Error('Cannot resolve client.');
  }
  if (!node.tagName) {
    throw Error('Invalid element provided.');
  }
  if (prop) {
    return window.getComputedStyle(node, pseudo).getPropertyValue(prop);
  }

  return window.getComputedStyle(node, pseudo);
}
