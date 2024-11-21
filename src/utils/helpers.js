// TODO: función para realizar validaciones
export const validateName = (name) => {
  return typeof name === "string" && name.trim() !== "";
}

export const validateEmail = (email) => {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const formatName = (name) => {
  return name
      .trim()
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

export const getLocation = async () => {
  if (navigator.geolocation) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const userLocation = new google.maps.LatLng(lat, lng);
          resolve(userLocation); 
        },
        (error) => {
          console.error('Error obtaining location:', error);
          reject(error); 
        }
      );
    });
  } else {
    console.error('Geolocalización no disponible');
    reject(new Error('Geolocalización no disponible'));
  }
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

export const clearListContainers =(containerList) => {
  containerList.forEach((container) => {
    container.innerHTML = "";
  })
}