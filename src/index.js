import {
  findMapElement,
  getDataAttr,
  parseBool,
  parseInteger,
  parseNumber,
} from "./dom.js";
import { getLegendData, renderLegend } from "./legend.js";
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

    // CRITICAL: Extract ALL DOM data BEFORE creating the map
    // because new google.maps.Map() clears the element's innerHTML
    const tooltipConfig = getTooltipConfig(
      mapElement,
      getDataAttr,
      parseBool,
    );

    const markerData = getMarkerData(
      mapElement,
      parseBool,
      parseNumber,
    );

    const legendData = getLegendData(mapElement, getDataAttr, parseBool);

    // Now create the map (this will clear mapElement's children)
    const map = createMap(mapElement, {
      getDataAttr,
      parseBool,
      parseNumber,
      parseInteger,
    });

    injectTooltipContainerStyles(tooltipConfig.styles);

    const infoWindow = new google.maps.InfoWindow();
    addMarkers({ map, markerData, tooltipConfig, infoWindow });

    renderLegend(map, legendData);
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
