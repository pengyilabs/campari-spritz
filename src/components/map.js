import { calculateClosingHour, calculateOpeningHour, clearListContainers } from "../utils/helpers.js";
import state from "../utils/state.js";
import { drawLoadingSkeleton } from "./loading-skeleton.js";
import { setupModals } from "../utils/modalRendering.js";
import ENVIRONMENT from "../../env.js";

const fetchPlaceIdList = async () => {
  const result = await fetch(ENVIRONMENT.CAMPARI_PLACES_URL);
  const data = await result.json();
  return data;
}

const fetchPlaceDetails = async (service, placeIds) => {
  const { spherical } = await google.maps.importLibrary("geometry");
  const userLocation = state.currentUserLocation;

  const placesPromises = placeIds.map(placeId => {
    const request = {
      placeId,
      fields: ["name", "rating", "formatted_address", "geometry", "vicinity", "photos", "opening_hours"],
    };

    return new Promise((resolve, reject) => {
      service.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          const distanceInMeters = spherical.computeDistanceBetween(
            userLocation,
            place.geometry.location
          );
          place.radius = distanceInMeters;
          place.place_id = placeId;
          resolve(place);
        } else {
          reject(new Error(`Error obtaining place: ${status}`));
        }
      });
    });
  });

  const placesList = await Promise.all(placesPromises);
  return placesList;
}

const filterAndOrderPlaces = async (places, distance, orderByPopularity) => {
  // convert km to mts
  const maxDistance = distance * 1000;

  return await places
    .filter(place => place.radius <= maxDistance)
    .sort((a, b) => {
      if(orderByPopularity) {
        return b.rating - a.rating;
      } else {
        return a.radius - b.radius;
      }
    });
}

const createHtmlPlacesList = (places) => {
  const htmlPlaces = places.map(place => {
    const openingHour = calculateOpeningHour(place.opening_hours);
    const closingHour = calculateClosingHour(place.opening_hours);

    return `
      <div class="bar-item">
        <div class="bar-item__info-container">
          <h3 class="bar-item__title">${place.name || 'Bar Name'}</h3>
          <div class="bar-item__address-container flex gap-2">
            <img src="src/assets/icons/map-pin.svg" />
            <p class="bar-item__address-text">${place.formatted_address || 'Address not available'}</p>
          </div>
          <div class="bar-item__rating text-yellow-500 mb-2">
          ${place.rating || 'N/A'} ${'<img src="./src/assets/icons/star.svg" />'.repeat(Math.round(place.rating || 0))}
          </div>
          <p class="bar-item__is-opening">
            ${place.opening_hours?.isOpen() ?
              `<span class="bar-item__is-opening__open">Open</span> - Closes ${closingHour}` :
              `<span class="bar-item__is-opening__closed">Closed</span> - Opens ${openingHour}`}
          </p>
          <button data-modal-target="voucherModal" data-placeid=${place.place_id} class="bar-item__claim-voucher-button hover:bg-light-red transition-all">CLAIM VOUCHER</button>
        </div>
        <figure class="bar-item__bar-image-container">
          <img class="bar-item__bar-image-container_img" src=${place.photos[0].getUrl()} alt="Bar Image">
        </figure>
      </div>
    `;
  });

  if(places.length === 0) {
    htmlPlaces.push(`
      <div class="bars-not-found">
        <h2 class="bars-not-found__title">We couldn't find any bars near you ;(</h2>
        <p class="bars-not-found__description">Try searching for another location or expand the maximum distance</p>
      </div>
    `)
  }
  
  return htmlPlaces;
}

const createMarkers = (places, map) => {
  places.forEach(place => {
    createMarker(place, map);
  });
}

const createMarker = (place, map) => {
  if (!place.geometry || !place.geometry.location) return;

  const markerContent = document.createElement("div");
  markerContent.className = "custom-marker";
  markerContent.innerHTML = `
    <img src="./src/assets/images/map-marker.svg" alt="${place.name}" style="width: 32px; height: 32px;" />
  `;
  
  const marker = new google.maps.marker.AdvancedMarkerElement({
    map: map,
    position: place.geometry.location,
    title: place.name,
    content: markerContent,
  });
  
  let photoUrl = "";
  if (place.photos) {
    photoUrl = place.photos[0].getUrl();
  }
  
  const infoWindowContent = `
    <div class="info-window-container">
      ${photoUrl !== "" ? `
        <figure class="info-window-image-container">
          <img src="${photoUrl}" class="info-window-image" alt="${place.name}" />
        </figure>
      ` : ""}
      <h3 class="info-window-title">${place.name}</h3>
      <p>${place.vicinity || ''}</p>
      <div class="info-window-rating">
        ${place.rating ? `<p>Rating: ${place.rating}</p><img src="./src/assets/icons/star.svg" alt="Star" />` : ''}
      </div>
      <button id="claimVoucherButton" data-modal-target="voucherModal" data-placeid="${place.place_id}" 
        class="info-window-button">
        Claim Voucher
      </button>
    </div>
  `;
  
  const infoWindow = new google.maps.InfoWindow({
    content: infoWindowContent,
  });
  
  marker.addListener('click', async () => {
    await infoWindow.open({
      anchor: marker,
      map,
    });
    setupModals();
  });
}

export const initMap = async () => {
  try {
    const { lat, lng } = await state.currentUserLocation;
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Map element not found');
      return;
    }

    mapElement.style.height = '400px'; 

    const mapOptions = {
      center: { lat: lat(), lng: lng() },
      zoom: 14,
      mapId: ENVIRONMENT.MAP_ID
    };

    const map = new google.maps.Map(mapElement, mapOptions);
    
    new google.maps.marker.AdvancedMarkerElement({
      position: { lat: lat(), lng: lng() },
      map: map,
      title: 'Your location'
    });

    // Búsqueda de lugares cercanos

    // Loading Skeleton
    drawLoadingSkeleton();
    const service = new google.maps.places.PlacesService(map);
    const barListMobile = document.querySelector("#bar-list-mobile");
    const barListDesktop = document.querySelector("#bar-list-desktop");
    
    const placeIds = await fetchPlaceIdList();
    state.placesList = await fetchPlaceDetails(service, placeIds);

    const orderedPlacesList = await filterAndOrderPlaces(state.placesList, state.distance, state.orderByPopularity);
    clearListContainers([barListMobile, barListDesktop]);
    const htmlPlacesList = createHtmlPlacesList(orderedPlacesList);

    barListMobile.insertAdjacentHTML('beforeend', htmlPlacesList.join(""));
    barListDesktop.insertAdjacentHTML('beforeend', htmlPlacesList.join(""));

    createMarkers(orderedPlacesList, map);
    setupModals();
  } catch (error) {
    console.error('Error initializing the map:', error);
  }
}