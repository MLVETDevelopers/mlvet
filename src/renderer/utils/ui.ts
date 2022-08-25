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

/**
 * Measure text logic adapted from
 * https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */

// canvas object gets reused for better performance
const GLOBAL_CANVAS = document.createElement('canvas');

/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 *
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 *
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
export const getTextWidth: (
  text: string,
  font: string | null
) => number | null = (text, font) => {
  if (font === null) {
    return null;
  }

  const canvas = GLOBAL_CANVAS;

  const context = canvas.getContext('2d');
  if (context !== null) {
    context.font = font;
  }
  const metrics = context?.measureText(text);
  return metrics?.width ?? null;
};

const getCssStyle: (element: HTMLElement, prop: string) => string = (
  element,
  prop
) => {
  return window.getComputedStyle(element, null).getPropertyValue(prop);
};

export const getCanvasFont: (
  element: HTMLElement | null,
  defaultFontWeight?: string,
  defaultFontSize?: string,
  defaultFontFamily?: string
) => string | null = (element, ...defaults) => {
  const props = ['font-weight', 'font-size', 'font-family'];

  return props
    .map((prop, i) => (element && getCssStyle(element, prop)) || defaults[i])
    .join(' ');
};
