/* Returns the style declaration for an element */
export const getElementStyle: (
  elem: Element
) => CSSStyleDeclaration | undefined = (elem) => {
  try {
    return window.getComputedStyle(elem);
  } catch {
    return undefined;
  }
};

/* Returns the height and width of an element */
export const getElementSize: (elem: Element) =>
  | {
      width: number;
      height: number;
    }
  | undefined = (elem) => {
  const style = getElementStyle(elem);
  return style
    ? {
        width: parseFloat(style.width),
        height: parseFloat(style.height),
      }
    : undefined;
};

/* Returns the aspect ratio of an element calculated as width / height */
export const getAspectRatio: (
  elem: Element,
  defaultAspectRatio: number
) => number = (elem, defaultAspectRatio) => {
  const elemSize = getElementSize(elem);
  return elemSize ? elemSize.width / elemSize.height : defaultAspectRatio;
};
