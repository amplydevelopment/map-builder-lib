import { DATA_ATTR } from "./constants.js";
import {
  attachInfoWindowOverflowFix,
  buildTooltipContent,
} from "./tooltip.js";

/**
 * Extract marker data from map element children.
 * @param {Element} mapElement
 * @param {(value: string|null) => boolean} parseBool
 * @param {(value: string|null, defaultValue: number) => number} parseNumber
 * @returns {Array<object>}
 */
export function getMarkerData(mapElement, parseBool, parseNumber) {
  const markerElements = mapElement.querySelectorAll(
    '[data-type="marker"]',
  );
  const markerData = [];

  markerElements.forEach(function (markerEl) {
    markerData.push({
      lat: parseNumber(
        markerEl.getAttribute(DATA_ATTR.markerLat),
        0,
      ),
      lng: parseNumber(
        markerEl.getAttribute(DATA_ATTR.markerLng),
        0,
      ),
      visible: parseBool(
        markerEl.getAttribute(DATA_ATTR.markerVisible),
      ),
      title: markerEl.getAttribute(DATA_ATTR.markerTitle) || "",
      description:
        markerEl.getAttribute(DATA_ATTR.markerDescription) || "",
      color: markerEl.getAttribute(DATA_ATTR.markerColor),
      icon: markerEl.getAttribute(DATA_ATTR.markerIcon),
    });
  });

  return markerData;
}

/**
 * Add markers to the map and wire up tooltips.
 * @param {object} params
 */
export function addMarkers({
  map,
  markerData,
  tooltipConfig,
  infoWindow,
}) {
  let firstMarkerShown = false;

  markerData.forEach(function (markerDataItem) {
    if (
      !markerDataItem.visible ||
      (markerDataItem.lat === 0 && markerDataItem.lng === 0)
    ) {
      return;
    }

    const marker = new google.maps.Marker({
      position: {
        lat: markerDataItem.lat,
        lng: markerDataItem.lng,
      },
      map: map,
      title: markerDataItem.title,
      icon: getMarkerIcon(markerDataItem),
    });

    const showTooltip = function () {
      const styledContent = buildTooltipContent({
        template: tooltipConfig.template,
        title: markerDataItem.title,
        description: markerDataItem.description,
        textColor: tooltipConfig.styles.textColor,
        fontSize: tooltipConfig.styles.fontSize,
        fontFamily: tooltipConfig.styles.fontFamily,
        padding: tooltipConfig.styles.padding,
      });

      infoWindow.setContent(styledContent);
      attachInfoWindowOverflowFix(infoWindow);
      infoWindow.open(map, marker);
    };

    if (tooltipConfig.trigger === "click") {
      marker.addListener("click", showTooltip);
    } else if (tooltipConfig.trigger === "hover") {
      marker.addListener("mouseover", showTooltip);
      marker.addListener("mouseout", function () {
        infoWindow.close();
      });
    }

    if (tooltipConfig.autoOpen && !firstMarkerShown) {
      showTooltip();
      firstMarkerShown = true;
    }
  });
}

function getMarkerIcon(markerDataItem) {
  if (markerDataItem.icon) return markerDataItem.icon;
  if (!markerDataItem.color) return undefined;

  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: markerDataItem.color,
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: 2,
    scale: 8,
  };
}
