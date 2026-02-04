import { DATA_ATTR, DEFAULTS } from "./constants.js";

/**
 * Create a Google Map instance from DOM configuration.
 * @param {Element} mapElement
 * @param {object} helpers
 * @returns {google.maps.Map}
 */
export function createMap(
  mapElement,
  { getDataAttr, parseBool, parseNumber, parseInteger },
) {
  const centerLat = parseNumber(
    getDataAttr(mapElement, DATA_ATTR.mapCenterLat),
    DEFAULTS.mapCenterLat,
  );
  const centerLng = parseNumber(
    getDataAttr(mapElement, DATA_ATTR.mapCenterLng),
    DEFAULTS.mapCenterLng,
  );
  const zoom = parseInteger(
    getDataAttr(mapElement, DATA_ATTR.mapZoom),
    DEFAULTS.mapZoom,
  );
  const mapTypeIdStr =
    getDataAttr(mapElement, DATA_ATTR.mapType) ||
    DEFAULTS.mapType;
  const mapTypeId =
    google.maps.MapTypeId[mapTypeIdStr.toUpperCase()] ||
    google.maps.MapTypeId.ROADMAP;

  const map = new google.maps.Map(mapElement, {
    center: { lat: centerLat, lng: centerLng },
    zoom: zoom,
    mapTypeId: mapTypeId,
    zoomControl: parseBool(
      getDataAttr(mapElement, DATA_ATTR.controlZoom),
    ),
    streetViewControl: parseBool(
      getDataAttr(mapElement, DATA_ATTR.controlStreetView),
    ),
    fullscreenControl: parseBool(
      getDataAttr(mapElement, DATA_ATTR.controlFullscreen),
    ),
    mapTypeControl: parseBool(
      getDataAttr(mapElement, DATA_ATTR.controlMapType),
    ),
    scaleControl: parseBool(
      getDataAttr(mapElement, DATA_ATTR.controlScale),
    ),
  });

  applyLayers(mapElement, map, getDataAttr, parseBool);

  return map;
}

/**
 * Inject custom CSS from a data attribute.
 * @param {Element} mapElement
 * @param {(el: Element, name: string) => string|null} getDataAttr
 */
export function applyCustomCss(mapElement, getDataAttr) {
  const customCss = getDataAttr(mapElement, DATA_ATTR.customCss);
  if (!customCss) return;

  const style = document.createElement("style");
  style.textContent = customCss;
  document.head.appendChild(style);
}

/**
 * Check Google Maps API availability.
 * @returns {boolean}
 */
export function isGoogleMapsReady() {
  try {
    return (
      window.google &&
      window.google.maps &&
      typeof google.maps.Map === "function" &&
      typeof google.maps.Marker === "function" &&
      typeof google.maps.InfoWindow === "function" &&
      typeof google.maps.TrafficLayer === "function" &&
      typeof google.maps.TransitLayer === "function" &&
      typeof google.maps.BicyclingLayer === "function" &&
      google.maps.MapTypeId &&
      google.maps.ControlPosition &&
      google.maps.SymbolPath
    );
  } catch (e) {
    return false;
  }
}

/**
 * Wait for Google Maps API before initialization.
 * @param {() => void} callback
 * @param {number} timeoutMs
 */
export function waitForGoogleMaps(callback, timeoutMs = 10000) {
  const startTime = Date.now();

  function check() {
    if (isGoogleMapsReady()) {
      callback();
    } else if (Date.now() - startTime < timeoutMs) {
      setTimeout(check, 50);
    } else {
      console.error(
        "Google Maps API failed to load within " +
          timeoutMs +
          "ms",
      );
    }
  }

  check();
}

function applyLayers(mapElement, map, getDataAttr, parseBool) {
  if (parseBool(getDataAttr(mapElement, DATA_ATTR.layerTraffic))) {
    const trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
  }
  if (parseBool(getDataAttr(mapElement, DATA_ATTR.layerTransit))) {
    const transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);
  }
  if (parseBool(getDataAttr(mapElement, DATA_ATTR.layerBicycling))) {
    const bicyclingLayer = new google.maps.BicyclingLayer();
    bicyclingLayer.setMap(map);
  }
}
