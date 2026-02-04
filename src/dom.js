/**
 * Find the map root element.
 * @returns {Element|null}
 */
export function findMapElement() {
  return document.querySelector("[amply-map]");
}

/**
 * Read a data attribute from a DOM element.
 * @param {Element} element
 * @param {string} name
 * @returns {string|null}
 */
export function getDataAttr(element, name) {
  return element.getAttribute(name);
}

/**
 * Parse a boolean from a data attribute string.
 * @param {string|null} value
 * @returns {boolean}
 */
export function parseBool(value) {
  return value === "true";
}

/**
 * Parse a float with a default fallback.
 * @param {string|null} value
 * @param {number} defaultValue
 * @returns {number}
 */
export function parseNumber(value, defaultValue) {
  const num = parseFloat(value);
  return Number.isNaN(num) ? defaultValue : num;
}

/**
 * Parse an integer with a default fallback.
 * @param {string|null} value
 * @param {number} defaultValue
 * @returns {number}
 */
export function parseInteger(value, defaultValue) {
  const num = parseInt(value ?? "", 10);
  return Number.isNaN(num) ? defaultValue : num;
}
