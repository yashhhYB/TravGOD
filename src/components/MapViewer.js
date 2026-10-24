/**
 * MapViewer.js — Leaflet wrapper for TRAVGOD Dashboard
 * Powered by CARTO Basemaps Voyager Raster Tiles (Key provided)
 */

export class MapViewer {
  constructor(containerId, centerCoords) {
    this.map = L.map(containerId, {
      center: centerCoords,
      zoom: 13,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // Official CARTO Voyager Raster Tiles with User API Key
    const cartoKey = 'cb1_4hsg_1_984483a4175c34d8b6e7d692';
    const tileUrl = `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${cartoKey}`;

    L.tileLayer(tileUrl, {
      subdomains: 'abcd',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
      maxZoom: 20
    }).addTo(this.map);

    this.markers = [];
  }

  addMarker(coords, options = {}) {
    const marker = L.marker(coords, options).addTo(this.map);
    this.markers.push(marker);
    return marker;
  }

  addCircle(coords, radiusMeters, options = {}) {
    const circle = L.circle(coords, { radius: radiusMeters, ...options }).addTo(this.map);
    this.markers.push(circle);
    return circle;
  }

  clearMarkers() {
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];
  }

  setView(coords, zoom = 13) {
    if (this.map) {
      this.map.setView(coords, zoom);
    }
  }

  flyTo(coords, zoom = 14) {
    if (this.map) {
      this.map.flyTo(coords, zoom, { duration: 1.2 });
    }
  }

  invalidateSize() {
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  destroy() {
    if (this.map) {
      this.map.remove();
    }
  }
}
