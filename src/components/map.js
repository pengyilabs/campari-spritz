import { getLocation, calculateClosingHour, calculateOpeningHour } from "../utils/helpers.js";
import state from "../utils/state.js";
import { setupModals } from "./modal.js";

async function fetchPlaceIdList() {
  const result = await fetch("https://api.gratisspritz.com/places");
  const data = await result.json();
  return data;
}

async function fetchPlaceDetails(service, placeIds) {
  const { spherical } = await google.maps.importLibrary("geometry");
  const placesList = [];
  const userLocation = await getLocation();

  for (const placeId of placeIds) {
    const request = {
      placeId: placeId,
      fields: ["name", "rating", "formatted_address", "geometry", "vicinity", "photos", "opening_hours"],
    };

    const place = await new Promise((resolve, reject) => {
      service.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(place);
        } else {
          reject(new Error(`Error obtaining place: ${status}`));
        }
      });
    });

    const distanceInMeters = await spherical.computeDistanceBetween(
      userLocation,
      place.geometry.location
    );
    place.radius = distanceInMeters;
    placesList.push(place);
  }

  return placesList;
}

async function filterAndOrderPlaces(places, maxDistance, minPopularity) {
  return await places
    .filter(place => place.radius <= maxDistance && place.rating >= minPopularity)
    .sort((a, b) => a.radius - b.radius);
}

function createHtmlPlacesList(places) {
  return places.map(place => {
    const openingHour = calculateOpeningHour(place.opening_hours);
    const closingHour = calculateClosingHour(place.opening_hours);

    state.place = place;
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
          <button data-modal-target="voucherModal" data-place=${place} class="bar-item__claim-voucher-button hover:bg-light-red transition-all">CLAIM VOUCHER</button>
        </div>
        <figure class="bar-item__bar-image-container">
          <img class="bar-item__bar-image-container_img" src=${place.photos[0].getUrl()} alt="Bar Image">
        </figure>
      </div>
    `;
  });
}

function createMarkers(places, map) {
  places.forEach(place => {
    createMarker(place, map);
  });
}

function createMarker(place, map) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    title: place.name,
    icon: {
      url: './src/assets/images/map-marker.svg',
      scaledSize: new google.maps.Size(32, 32)
    }
  });

  let photoUrl = "";
  if(place.photos) {
    photoUrl = place.photos[0].getUrl();
  }

  const infoWindow = new google.maps.InfoWindow({
    content: `
    <div class="bg-white text-dark-gray p-2">
      ${photoUrl !== "" && `
        <figure class="w-60 h-32 overflow-hidden">
          <image src=${photoUrl} class="fit-fill w-full">
        </figure>
      `}
      <h3 class="font-bold mb-1 lg:text-lg" style="font-weight: bold; margin-bottom: 5px;">${place.name}</h3>
      <p>${place.vicinity || ''}</p>
      <div class="flex gap-2 mb-4">
        ${place.rating ? `<p>Rating: ${place.rating}</p><img src="./src/assets/icons/star.svg"/>` : ''}
      </div>
      <button id="claimVoucherButton" data-modal-target="voucherModal"
        class="bg-red-campari text-white py-2 px-4 border-none rounded mt-1">
        Claim Voucher
      </button>
    </div>
    `
  });

  marker.addListener('click', async () => {
    await infoWindow.open(map, marker);
    setupModals()
  });
}

export async function initMap() {
  try {
    const placeIds = await fetchPlaceIdList();
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
      styles: [],
    };

    const map = new google.maps.Map(mapElement, mapOptions);
    
    new google.maps.Marker({
      position: { lat: lat(), lng: lng() },
      map: map,
      title: 'Your location'
    });

    // Búsqueda de lugares cercanos
    const service = new google.maps.places.PlacesService(map);
    const barListMobile = document.querySelector("#bar-list-mobile");
    const barListDesktop = document.querySelector("#bar-list-desktop");

    const placesList = await fetchPlaceDetails(service, placeIds);
    const orderedPlacesList = await filterAndOrderPlaces(placesList, 3000, 2);
    const htmlPlacesList = createHtmlPlacesList(orderedPlacesList);

    barListMobile.insertAdjacentHTML('beforeend', htmlPlacesList.join(""));
    barListDesktop.insertAdjacentHTML('beforeend', htmlPlacesList.join(""));

    createMarkers(orderedPlacesList, map);
    setupModals();
  } catch (error) {
    console.error('Error initializing the map:', error);
  }
}