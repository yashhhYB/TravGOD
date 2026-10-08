/**
 * MapViewer.js — Leaflet wrapper for TRAVGOD Dashboard
 */

export class MapViewer {
  constructor(containerId, centerCoords) {
    this.map = L.map(containerId, {
      center: centerCoords,
      zoom: 13,
      zoomControl: false // We will position it manually if needed, or leave it off for a cleaner look
    });

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // CartoDB Positron (Light) tile layer for professional airy aesthetic
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(this.map);

    this.markers = [];
  }

  // Future method for adding markers (Guides, Food, etc.)
  addMarker(coords, options = {}) {
    const marker = L.marker(coords, options).addTo(this.map);
    this.markers.push(marker);
    return marker;
  }

  clearMarkers() {
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];
  }

  destroy() {
    if (this.map) {
      this.map.remove();
    }
  }
}
