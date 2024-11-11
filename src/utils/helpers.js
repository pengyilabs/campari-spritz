// Ejemplo: Función auxiliar para validaciones
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export const getLocation = async () => {
/*   let lat, lng;
  if (navigator.geolocation) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
          lat = position.coords.latitude;
          lng = position.coords.longitude;
          resolve({ lat, lng }); 
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
          reject(error); 
        }
      );
    });
  } else {
    // Coordenadas de Buenos Aires
    lat = -34.397; 
    lng = 150.644; 

    // TESTING PURPOSES
    lat = 48.13763729999999;
    lng = 11.5797494;
    return { lat, lng };
  } */

  // TESTING PURPOSES
  const lat = 48.13763729999999;
  const lng = 11.5797494;
  const userLocation = new google.maps.LatLng(
    lat,
    lng
  );
  return userLocation
};

/* const HTMLItem = `
      <div class="bg-white m-4 p-4 shadow-lg flex items-center text-gray-800">
        <img src="./src/assets/images/bar-image.png" alt="Bar Image" class="w-24 h-24 mr-4 object-cover">
        <div>
          <h3 class="font-bold text-xl">${retrievedPlace.name || 'Bar Name'}</h3>
          <p>${retrievedPlace.formatted_address || 'Address not available'}</p>
          <div class="text-yellow-500 mb-2">
            ${'⭐'.repeat(Math.round(retrievedPlace.rating || 0))} (${retrievedPlace.rating || 'N/A'})
          </div>
          <p class="text-green-600 font-semibold">
            ${retrievedPlace.opening_hours?.isOpen() ? 'Open' : 'Closed'}
          </p>
          <button data-modal-target="voucherModal" class="claim-voucher-button bg-red-600 text-white px-4 py-2 rounded-md mt-2 hover:bg-red-700">CLAIM VOUCHER</button>
        </div>
      </div>
  `;
  barListHTML.insertAdjacentHTML('beforeend', HTMLItem); 
return barListHTML;
  */

