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

export const calculateOpeningHour = (openingHours) => {
  if (!openingHours) {
    return 'N/A';
  }
  
  try {
    const today = new Date().getDay();
    const periods = openingHours.periods;
    
    if (!periods || periods.length === 0) {
      return 'N/A';
    }
    
    const todayPeriod = periods.find(period => period.open.day === today);
    
    if (!todayPeriod) {
      return 'N/A';
    }
    
    const time = todayPeriod.open.time;
    const hours = parseInt(time.substring(0, 2));
    const minutes = time.substring(2, 4);
    
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    
    return `${formattedHours.toString().padStart(2, '0')}:${minutes} ${period}`;
  } catch (error) {
    console.error('Error calculating opening hour:', error);
    return 'N/A';
  }
}

export const calculateClosingHour = (openingHours) => {
  if (!openingHours) {
    return 'N/A';
  }

  try {
    const today = new Date().getDay();
    const periods = openingHours.periods;
    
    if (!periods || periods.length === 0) {
      return 'N/A';
    }

    const todayPeriod = periods.find(period => period.close.day === today);
    
    if (!todayPeriod) {
      return 'N/A';
    }

    const time = todayPeriod.close.time;
    const hours = parseInt(time.substring(0, 2));
    const minutes = time.substring(2, 4);
    
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    
    return `${formattedHours.toString().padStart(2, '0')}:${minutes} ${period}`;
  } catch (error) {
    console.error('Error calculating closing hour:', error);
    return 'N/A';
  }
}