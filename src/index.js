// import { initMap } from './components/map.js';
import { setupModals } from './components/modal.js';
import { setupFormHandlers } from './components/form.js';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
//   initMap();          // Initialize Google Maps
  setupModals();      // Set up modals
  setupFormHandlers(); // Set up form handlers (if any)

  // Add event listener to "CLAIM MY FREE DRINK" button to change the view
  const claimDrinkButton = document.getElementById('claim-drink-button');
  if (claimDrinkButton) {
    claimDrinkButton.addEventListener('click', () => {
      document.getElementById('promotion-section').classList.add('hidden');
      document.getElementById('bar-listing-section').classList.remove('hidden');
    });
  }
});
