export function initMap() {
    const mapElement = document.getElementById('map');
    if (mapElement) {
      const map = new google.maps.Map(mapElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 14,
      });
  
      // Servicio de Places
      const service = new google.maps.places.PlacesService(map);
      
      // Realizamos una búsqueda de restaurantes cercanos
      const request = {
        location: map.getCenter(),
        radius: '1500', // Radio de búsqueda en metros
        type: ['restaurant'], // Tipo de lugar (en este caso, restaurantes)
      };
  
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          results.forEach((place) => {
            createMarker(place, map);
          });
        }
      });
  
      // Crear un marcador para cada lugar encontrado
      function createMarker(place, map) {
        if (!place.geometry || !place.geometry.location) return;
  
        const marker = new google.maps.Marker({
          map,
          position: place.geometry.location,
        });
  
        // Información de cada lugar
        const infoWindow = new google.maps.InfoWindow();
        marker.addListener('click', () => {
          infoWindow.setContent(`
            <div>
              <strong>${place.name}</strong><br>
              ${place.vicinity}
            </div>
          `);
          infoWindow.open(map, marker);
        });
      }
    }
  }
  