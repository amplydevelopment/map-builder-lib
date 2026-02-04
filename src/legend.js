import { DATA_ATTR, DEFAULTS } from "./constants.js";

/**
 * Render map legend from DOM data.
 * @param {Element} mapElement
 * @param {google.maps.Map} map
 * @param {(el: Element, name: string) => string|null} getDataAttr
 * @param {(value: string|null) => boolean} parseBool
 */
export function renderLegend(mapElement, map, getDataAttr, parseBool) {
  const legendEnabled = parseBool(
    getDataAttr(mapElement, DATA_ATTR.legendEnabled),
  );
  const legendPosition =
    getDataAttr(mapElement, DATA_ATTR.legendPosition) ||
    DEFAULTS.legendPosition;
  const legendItemsEl = mapElement.querySelectorAll(
    '[data-type="legend-item"]',
  );

  if (!legendEnabled || legendItemsEl.length === 0) {
    return;
  }

  const legend = document.createElement("div");
  legend.style.backgroundColor =
    getDataAttr(mapElement, DATA_ATTR.legendBgColor) ||
    DEFAULTS.legendBgColor;
  legend.style.color =
    getDataAttr(mapElement, DATA_ATTR.legendTextColor) ||
    DEFAULTS.legendTextColor;
  legend.style.padding = "10px";
  legend.style.margin = "10px";
  legend.style.borderRadius = "3px";
  legend.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  legend.style.fontFamily = "Arial, sans-serif";
  legend.style.fontSize = "14px";

  legendItemsEl.forEach(function (itemEl) {
    const label =
      itemEl.getAttribute(DATA_ATTR.legendLabel) || "";
    const color =
      itemEl.getAttribute(DATA_ATTR.legendColor) || "#000000";

    const div = document.createElement("div");
    div.style.marginBottom = "5px";
    div.style.display = "flex";
    div.style.alignItems = "center";

    const icon = document.createElement("span");
    icon.style.width = "20px";
    icon.style.height = "20px";
    icon.style.backgroundColor = color;
    icon.style.display = "inline-block";
    icon.style.marginRight = "8px";
    icon.style.borderRadius = "50%";
    icon.style.border = "2px solid white";
    icon.style.boxShadow = "0 1px 3px rgba(0,0,0,0.3)";

    const labelSpan = document.createElement("span");
    labelSpan.textContent = label;

    div.appendChild(icon);
    div.appendChild(labelSpan);
    legend.appendChild(div);
  });

  map.controls[
    google.maps.ControlPosition[legendPosition]
  ].push(legend);
}
