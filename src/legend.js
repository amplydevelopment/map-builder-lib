import { DATA_ATTR, DEFAULTS } from "./constants.js";

/**
 * Extract legend configuration and item data from DOM.
 * MUST be called BEFORE creating the map.
 * @param {Element} mapElement
 * @param {(el: Element, name: string) => string|null} getDataAttr
 * @param {(value: string|null) => boolean} parseBool
 * @returns {object} Legend configuration and items
 */
export function getLegendData(mapElement, getDataAttr, parseBool) {
  const legendEnabled = parseBool(
    getDataAttr(mapElement, DATA_ATTR.legendEnabled),
  );
  const legendPosition =
    getDataAttr(mapElement, DATA_ATTR.legendPosition) ||
    DEFAULTS.legendPosition;
  const legendBgColor =
    getDataAttr(mapElement, DATA_ATTR.legendBgColor) ||
    DEFAULTS.legendBgColor;
  const legendTextColor =
    getDataAttr(mapElement, DATA_ATTR.legendTextColor) ||
    DEFAULTS.legendTextColor;

  const legendItemsEl = mapElement.querySelectorAll(
    '[data-type="legend-item"]',
  );

  const items = [];
  legendItemsEl.forEach(function (itemEl) {
    items.push({
      label: itemEl.getAttribute(DATA_ATTR.legendLabel) || "",
      color: itemEl.getAttribute(DATA_ATTR.legendColor) || "#000000",
    });
  });

  return {
    enabled: legendEnabled,
    position: legendPosition,
    bgColor: legendBgColor,
    textColor: legendTextColor,
    items: items,
  };
}

/**
 * Render map legend from extracted data.
 * MUST be called AFTER creating the map.
 * @param {google.maps.Map} map
 * @param {object} legendData - Data from getLegendData()
 */
export function renderLegend(map, legendData) {
  if (!legendData.enabled || legendData.items.length === 0) {
    return;
  }

  const legend = document.createElement("div");
  legend.style.backgroundColor = legendData.bgColor;
  legend.style.color = legendData.textColor;
  legend.style.padding = "10px";
  legend.style.margin = "10px";
  legend.style.borderRadius = "3px";
  legend.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  legend.style.fontFamily = "Arial, sans-serif";
  legend.style.fontSize = "14px";

  legendData.items.forEach(function (item) {
    const div = document.createElement("div");
    div.style.marginBottom = "5px";
    div.style.display = "flex";
    div.style.alignItems = "center";

    const icon = document.createElement("span");
    icon.style.width = "20px";
    icon.style.height = "20px";
    icon.style.backgroundColor = item.color;
    icon.style.display = "inline-block";
    icon.style.marginRight = "8px";
    icon.style.borderRadius = "50%";
    icon.style.border = "2px solid white";
    icon.style.boxShadow = "0 1px 3px rgba(0,0,0,0.3)";

    const labelSpan = document.createElement("span");
    labelSpan.textContent = item.label;

    div.appendChild(icon);
    div.appendChild(labelSpan);
    legend.appendChild(div);
  });

  map.controls[
    google.maps.ControlPosition[legendData.position]
  ].push(legend);
}
