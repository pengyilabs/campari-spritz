import { initMap } from './components/map.js';
import { setupModals } from './utils/modalRendering.js';
import state from './utils/state.js';
import { getLocation } from './utils/helpers.js';
import { initPlacesAutocomplete } from './components/searchBar.js';
import ENVIRONMENT from '../env.js';

function loadGoogleMapsAPI() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${ENVIRONMENT.MAPS_API_KEY}&libraries=places,geometry,marker`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Error loading Google Maps API'));
    document.head.appendChild(script);
  });
}

export default async function initializeApp() {
  try {
    await loadGoogleMapsAPI();
    setupModals();
    state.currentUserLocation = await getLocation();
    initMap(); 
    initPlacesAutocomplete();

    const claimDrinkButton = document.getElementById('claim-drink-button');
    if (claimDrinkButton) {
      claimDrinkButton.addEventListener('click', () => {
        document.getElementById('promotion-section').classList.add('hidden');
        document.getElementById('bar-listing-section').classList.remove('hidden');
      });
    }

    const useMyCurrentLocationButton = document.querySelector("#useMyCurrentLocationButton");
    if (useMyCurrentLocationButton) {
      useMyCurrentLocationButton.addEventListener('click', async () => {
        state.currentUserLocation = await getLocation();
        initMap();
      });
    }
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

initializeApp();