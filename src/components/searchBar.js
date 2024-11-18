import state from "../utils/state.js";
import { initMap } from "./map.js";

export function initPlacesAutocomplete() {
  const searchInput = document.querySelector('#searchBar');
  const autocomplete = new google.maps.places.Autocomplete(searchInput);
  
  autocomplete.addListener('place_changed', async () => {
    const place = autocomplete.getPlace();
    
    if (!place.geometry) {
      return;
    }
    
    const newLocation = new google.maps.LatLng(
      place.geometry.location.lat(),
      place.geometry.location.lng()
    );
    
    state.currentUserLocation = newLocation;
    initMap();
  });
}