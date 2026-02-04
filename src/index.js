import {
  findMapElement,
  getDataAttr,
  parseBool,
  parseInteger,
  parseNumber,
} from "./dom.js";
import { renderLegend } from "./legend.js";
import { addMarkers, getMarkerData } from "./markers.js";
import { applyCustomCss, createMap, waitForGoogleMaps } from "./maps.js";
import {
  getTooltipConfig,
  injectTooltipContainerStyles,
} from "./tooltip.js";

(function () {
  function initMap() {
    const mapElement = findMapElement();
    if (!mapElement) {
      console.error("Map element not found");
      return;
    }

    const map = createMap(mapElement, {
      getDataAttr,
      parseBool,
      parseNumber,
      parseInteger,
    });

    const tooltipConfig = getTooltipConfig(
      mapElement,
      getDataAttr,
      parseBool,
    );
    injectTooltipContainerStyles(tooltipConfig.styles);

    const markerData = getMarkerData(
      mapElement,
      parseBool,
      parseNumber,
    );
    const infoWindow = new google.maps.InfoWindow();
    addMarkers({ map, markerData, tooltipConfig, infoWindow });

    renderLegend(mapElement, map, getDataAttr, parseBool);
    applyCustomCss(mapElement, getDataAttr);
  }

  if (typeof Webflow !== "undefined") {
    Webflow.push(function () {
      waitForGoogleMaps(initMap);
    });
  } else {
    waitForGoogleMaps(initMap);
  }
})();
