import { getLocation } from "../utils/helpers.js";

export async function initMap() {
  try {
    const placeIds = await fetchPlaceIdList();
    const { lat, lng } = await getLocation();
    
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
    
    // Marcador con la locación del usuario
    new google.maps.Marker({
      position: { lat: lat(), lng: lng() },
      map: map,
      title: 'Your location'
    });

    // Búsqueda de lugares cercanos
    const service = new google.maps.places.PlacesService(map);

    const barListBox = document.querySelector("#bar-list");
    const HTMLContent = await fetchPlaceDetails(service, placeIds);
    console.log("aber", HTMLContent);
    barListBox.insertAdjacentHTML('beforeend', HTMLContent);
  } catch (error) {
    console.error('Error initializing the map:', error);
  }
}

function createMarker(place, map) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker ({
    map: map,
    position: place.geometry.location,
    title: place.name,
    icon: {
      url: './src/assets/images/map-marker.svg',
      scaledSize: new google.maps.Size(32, 32)
    }
  });

  const infoWindow = new google.maps.InfoWindow({
    content: `
      <div style="color: black; padding: 8px;">
        <h3 style="font-weight: bold; margin-bottom: 5px;">${place.name}</h3>
        <p>${place.vicinity || ''}</p>
        ${place.rating ? `<p>Rating: ${place.rating} ⭐</p>` : ''}
        <button onclick="claimVoucher('${place.place_id}')" 
                style="background: #ff0000; color: white; padding: 5px 10px; border: none; border-radius: 4px; margin-top: 5px;">
          Claim Voucher
        </button>
      </div>
    `
  });

  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });
}

export const fetchPlaceIdList = async () => {
  const result = await fetch("https://guarded-bayou-29112-bff154a21112.herokuapp.com/https://dev-api.gratisspritz.com/places");
  const data = await result.json();
  return data;
}

export const fetchPlaceDetails = async (service, placeIds) => {
  const { spherical } = await google.maps.importLibrary("geometry");
  const placesList = [];
  const userLocation = await getLocation();

  for (const placeId of placeIds) {
    const request = {
      placeId: placeId,
      fields: ["name", "rating", "formatted_address", "geometry", "vicinity", "photos"],
    };

    try {
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
    } catch (error) {
      console.error("Error obtaining place:", error);
    }
  }

  const orderedPlacesList = await filterAndOrderPlaces(placesList.filter(Boolean), 3000, 2);
  return orderedPlacesList;
};

const filterAndOrderPlaces = async (places, maxDistance, minPopularity) => {
  return await places
    .filter(place => place.radius <= maxDistance && place.rating >= minPopularity)
    .sort((a, b) => a.radius - b.radius);
}