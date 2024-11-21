import { initMap } from './components/map.js';
import { setupModals } from './utils/modalRendering.js';
import state from './utils/state.js';
import { getLocation } from './utils/helpers.js';
import { initPlacesAutocomplete } from './components/searchBar.js';

// Exporta una función por defecto que inicializa todo
export default async function initializeApp() {
  setupModals();
  state.currentUserLocation = await getLocation();
  initMap(); // Inicializa el mapa
  initPlacesAutocomplete();

  const claimDrinkButton = document.getElementById('claim-drink-button');
  if (claimDrinkButton) {
    claimDrinkButton.addEventListener('click', () => {
      document.getElementById('promotion-section').classList.add('hidden');
      document.getElementById('bar-listing-section').classList.remove('hidden');
    });
  }

  const useMyCurrentLocationButton = document.querySelector("#useMyCurrentLocationButton");
  if(useMyCurrentLocationButton) {
    useMyCurrentLocationButton.addEventListener('click', async () => {
      state.currentUserLocation = await getLocation();
      initMap();
    })
  }
}