import { DATA_ATTR, DEFAULTS } from "./constants.js";

/**
 * Read tooltip configuration from the map element.
 * @param {Element} mapElement
 * @param {(el: Element, name: string) => string|null} getDataAttr
 * @param {(value: string|null) => boolean} parseBool
 * @returns {object}
 */
export function getTooltipConfig(mapElement, getDataAttr, parseBool) {
  return {
    type:
      getDataAttr(mapElement, DATA_ATTR.tooltipType) ||
      DEFAULTS.tooltipType,
    trigger:
      getDataAttr(mapElement, DATA_ATTR.tooltipTrigger) ||
      DEFAULTS.tooltipTrigger,
    autoOpen: parseBool(
      getDataAttr(mapElement, DATA_ATTR.tooltipAutoOpen),
    ),
    template: getDataAttr(mapElement, DATA_ATTR.tooltipTemplate),
    styles: {
      bgColor: getDataAttr(mapElement, DATA_ATTR.tooltipBgColor),
      textColor: getDataAttr(mapElement, DATA_ATTR.tooltipTextColor),
      borderRadius: getDataAttr(
        mapElement,
        DATA_ATTR.tooltipBorderRadius,
      ),
      padding: getDataAttr(mapElement, DATA_ATTR.tooltipPadding),
      fontSize: getDataAttr(mapElement, DATA_ATTR.tooltipFontSize),
      fontFamily: getDataAttr(
        mapElement,
        DATA_ATTR.tooltipFontFamily,
      ),
      borderWidth: getDataAttr(
        mapElement,
        DATA_ATTR.tooltipBorderWidth,
      ),
      borderColor: getDataAttr(
        mapElement,
        DATA_ATTR.tooltipBorderColor,
      ),
      borderStyle: getDataAttr(
        mapElement,
        DATA_ATTR.tooltipBorderStyle,
      ),
      boxShadow: getDataAttr(mapElement, DATA_ATTR.tooltipBoxShadow),
      maxWidth: getDataAttr(mapElement, DATA_ATTR.tooltipMaxWidth),
    },
  };
}

/**
 * Injects tooltip container styles once per page.
 * @param {object} styles
 */
export function injectTooltipContainerStyles(styles) {
  const {
    bgColor,
    borderRadius,
    borderWidth,
    borderColor,
    borderStyle,
    boxShadow,
    maxWidth,
  } = styles;

  const iwCStyles = ["padding: 0 !important"];
  if (bgColor)
    iwCStyles.push(
      "background-color: " + bgColor + " !important",
    );
  if (borderRadius)
    iwCStyles.push("border-radius: " + borderRadius + " !important");
  if (borderWidth)
    iwCStyles.push("border-width: " + borderWidth + " !important");
  if (borderColor)
    iwCStyles.push("border-color: " + borderColor + " !important");
  if (borderStyle)
    iwCStyles.push("border-style: " + borderStyle + " !important");
  if (boxShadow)
    iwCStyles.push("box-shadow: " + boxShadow + " !important");
  if (maxWidth)
    iwCStyles.push("max-width: " + maxWidth + " !important");

  const iwStyles = [];
  if (bgColor)
    iwStyles.push("background-color: " + bgColor + " !important");
  if (borderRadius)
    iwStyles.push("border-radius: " + borderRadius + " !important");

  const containerStyles = [];
  if (iwCStyles.length > 0) {
    containerStyles.push(
      ".gm-style-iw-c { " + iwCStyles.join("; ") + " }",
    );
  }
  if (iwStyles.length > 0) {
    containerStyles.push(
      ".gm-style-iw { " + iwStyles.join("; ") + " }",
    );
  }
  if (bgColor) {
    containerStyles.push(
      ".gm-style-iw-tc::after { background: " +
        bgColor +
        " !important }",
    );
  }

  if (containerStyles.length > 0) {
    const styleId = "custom-tooltip-styles";
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = containerStyles.join("\n");
  }
}

/**
 * Build tooltip HTML content with inline text styles.
 * @param {object} params
 * @returns {string}
 */
export function buildTooltipContent({
  template,
  title,
  description,
  textColor,
  fontSize,
  fontFamily,
  padding,
}) {
  const contentStyles = [];
  if (textColor) contentStyles.push("color: " + textColor);
  if (fontSize) contentStyles.push("font-size: " + fontSize);
  if (fontFamily) contentStyles.push("font-family: " + fontFamily);
  const innerPadding = padding || DEFAULTS.tooltipPadding;
  contentStyles.push("padding: " + innerPadding);

  const styleAttr =
    contentStyles.length > 0
      ? ' style="' + contentStyles.join("; ") + '"'
      : "";

  const content = template
    ? template
        .replace(/\{title\}/g, title)
        .replace(/\{description\}/g, description)
    : "<div><h3>" +
      title +
      "</h3><p>" +
      description +
      "</p></div>";

  return "<div" + styleAttr + ">" + content + "</div>";
}

/**
 * Ensure InfoWindow scroll containers don't clip content.
 * @param {google.maps.InfoWindow} infoWindow
 */
export function attachInfoWindowOverflowFix(infoWindow) {
  google.maps.event.addListenerOnce(
    infoWindow,
    "domready",
    function () {
      const scrollContainers = document.querySelectorAll(
        ".gm-style-iw-d",
      );
      scrollContainers.forEach(function (container) {
        if (container instanceof HTMLElement) {
          container.style.overflow = "hidden";
        }
      });
    },
  );
}
