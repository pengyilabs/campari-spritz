import { getLocation } from "../utils/helpers.js";

export async function initMap() {
  try {
    const { lat: latitude, lng: longitude } = await getLocation();
    
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Map element not found');
      return;
    }

    mapElement.style.height = '400px'; 

    const mapOptions = {
      center: { lat: latitude, lng: longitude },
      zoom: 14,
      styles: [],
    };

    const map = new google.maps.Map(mapElement, mapOptions);
    
    // Marcador con la locación del usuario
    new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: map,
      title: 'Your location'
    });

    // Búsqueda de lugares cercanos
    const service = new google.maps.places.PlacesService(map);
    const request = {
      location: map.getCenter(),
      radius: 1500,
      type: ['bar']
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        results.forEach(place => createMarker(place, map));
        console.log(results)
      } else {
        console.error('Error in location search:', status);
      }
    });
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