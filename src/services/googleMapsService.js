/**
 * googleMapsService.js — Google Maps Platform Service for TRAVGOD
 * API Key: Provided by user (AIzaSyDGx9g0MWmfmiiwPBPTp9GWM_f23bplLXw)
 * Libraries: places, routes, geometry, visualization
 */

const GOOGLE_MAPS_KEY = 'AIzaSyDGx9g0MWmfmiiwPBPTp9GWM_f23bplLXw';

let googleMapsPromise = null;

/**
 * Load Google Maps JS API dynamically
 */
export function loadGoogleMaps() {
  if (window.google && window.google.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    // Check if script tag already exists
    const existingScript = document.getElementById('google-maps-js-sdk');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google.maps));
      existingScript.addEventListener('error', (e) => reject(e));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-js-sdk';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=places,geometry&v=weekly`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error('Google Maps SDK loaded but window.google.maps unavailable'));
      }
    };

    script.onerror = (err) => {
      console.warn('Google Maps script failed to load. Will fallback to Leaflet/interactive view.', err);
      reject(err);
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

/**
 * Initialize a Google Map instance
 */
export function initGoogleMap(container, options = {}) {
  const defaultOptions = {
    zoom: 13,
    center: { lat: 48.8566, lng: 2.3522 }, // Paris default
    mapTypeId: 'roadmap',
    tilt: 45, // Enable 3D perspective view
    heading: 0,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    zoomControl: true,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#746855' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#c9ecff' }]
      }
    ]
  };

  const map = new google.maps.Map(container, { ...defaultOptions, ...options });
  return map;
}

/**
 * Calculate Route using Google Maps DirectionsService
 */
export function calculateGoogleRoute(origin, destination, travelMode = 'DRIVING') {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps) {
      return reject(new Error('Google Maps SDK not loaded'));
    }

    const directionsService = new google.maps.DirectionsService();
    const mode = google.maps.TravelMode[travelMode] || google.maps.TravelMode.DRIVING;

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: mode,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result.routes && result.routes.length > 0) {
          const route = result.routes[0];
          const leg = route.legs[0];
          resolve({
            distanceText: leg.distance.text,
            distanceValue: leg.distance.value,
            durationText: leg.duration.text,
            durationValue: leg.duration.value,
            startAddress: leg.start_address,
            endAddress: leg.end_address,
            startLocation: leg.start_location,
            endLocation: leg.end_location,
            steps: leg.steps,
            rawResult: result
          });
        } else {
          reject(new Error(`Directions request failed: ${status}`));
        }
      }
    );
  });
}

/**
 * Perform Places Autocomplete setup on an input element
 */
export function attachPlacesAutocomplete(inputElement, onPlaceSelect) {
  if (!window.google || !window.google.maps || !window.google.maps.places) return null;

  const autocomplete = new google.maps.places.Autocomplete(inputElement, {
    types: ['(cities)'],
  });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (place && place.geometry) {
      onPlaceSelect({
        name: place.name || place.formatted_address,
        formattedAddress: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        photos: place.photos ? place.photos.map(p => p.getUrl({ maxWidth: 600 })) : [],
        placeId: place.place_id
      });
    }
  });

  return autocomplete;
}

/**
 * Fetch Nearby Places using Google Places Service
 */
export function fetchNearbyPlaces(map, location, type = 'restaurant') {
  return new Promise((resolve) => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      return resolve([]);
    }

    const service = new google.maps.places.PlacesService(map);
    const pyrmont = new google.maps.LatLng(location.lat, location.lng);

    service.nearbySearch(
      {
        location: pyrmont,
        radius: 3000,
        type: [type]
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results.map(p => ({
            id: p.place_id,
            name: p.name,
            rating: p.rating || 4.5,
            userRatingsTotal: p.user_ratings_total || 120,
            address: p.vicinity,
            coords: [p.geometry.location.lat(), p.geometry.location.lng()],
            lat: p.geometry.location.lat(),
            lng: p.geometry.location.lng(),
            photoUrl: p.photos && p.photos.length > 0 ? p.photos[0].getUrl({ maxWidth: 400 }) : null,
            icon: p.icon
          })));
        } else {
          resolve([]);
        }
      }
    );
  });
}
