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
