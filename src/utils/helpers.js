import state from "./state.js";
// TODO: función para realizar validaciones
export const validateName = (name) => {
  return typeof name === "string" && name.trim() !== "";
};

export const validateEmail = (email) => {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const formatName = (name) => {
  return name
    .trim()
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getLocation = async () => {
  if (navigator.geolocation) {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const userLocation = new google.maps.LatLng(lat, lng);
          resolve(userLocation);
        },
        () => {
          if (state.firstTimeUsingGeolocation) {
            state.firstTimeUsingGeolocation = false;
            let standardLocation = new google.maps.LatLng(52.52, 13.405); // Berlin
            resolve(standardLocation);
          } else {
            alert("Please enable geolocation so we can find your location");
          }
        }
      );
    });
  } else {
    if (state.firstTimeUsingGeolocation) {
      state.firstTimeUsingGeolocation = false;
      const standardLocation = new google.maps.LatLng(52.52, 13.405); // Berlin
      return Promise.resolve(standardLocation);
    } else {
      alert("Please enable geolocation so we can find your location");
    }
  }
};

export const calculateOpeningHour = (openingHours) => {
  if (!openingHours) {
    return "N/A";
  }

  try {
    const today = new Date().getDay();
    const periods = openingHours.periods;

    if (!periods || periods.length === 0) {
      return "N/A";
    }

    const todayPeriod = periods.find((period) => period.open.day === today);

    if (!todayPeriod) {
      return "N/A";
    }

    const time = todayPeriod.open.time;
    const hours = parseInt(time.substring(0, 2));
    const minutes = time.substring(2, 4);

    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    return `${formattedHours.toString().padStart(2, "0")}:${minutes} ${period}`;
  } catch (error) {
    console.error("Error calculating opening hour:", error);
    return "N/A";
  }
};

export const calculateClosingHour = (openingHours) => {
  if (!openingHours) {
    return "N/A";
  }

  try {
    const today = new Date().getDay();
    const periods = openingHours.periods;

    if (!periods || periods.length === 0) {
      return "N/A";
    }

    const todayPeriod = periods.find((period) => period.close.day === today);
    if (!todayPeriod) {
      return "N/A";
    }

    const time = todayPeriod.close.time;
    const hours = parseInt(time.substring(0, 2));
    const minutes = time.substring(2, 4);

    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    return `${formattedHours.toString().padStart(2, "0")}:${minutes} ${period}`;
  } catch (error) {
    console.error("Error calculating closing hour:", error);
    return "N/A";
  }
};

export const clearListContainers = (containerList) => {
  containerList.forEach((container) => {
    container.innerHTML = "";
  });
};

export const checkCachedData = (data) => {
  // Only one sample is necessary to check the persisted data has the right structure
  if (data) {
    const sample = data[0];
    if (
      sample?.name &&
      sample?.place_id &&
      sample?.radius &&
      checkUpdatedTime(sample.updatedDate)
    )
      return true;
  }
  return false;
};

export const persistData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const retrieveData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const checkUpdatedTime = (storedTimestamp) => {
  // Limit of 10 minutes
  const tenMinutesInMilliseconds = 10 * 60 * 1000;
  const currentTime = Date.now();

  // Return true if it doesn't pass the limit
  return currentTime - storedTimestamp <= tenMinutesInMilliseconds;
};

const isMobile = () => window.innerWidth < 1024;

export const handleResize = (callback) => {
  // Ejecuta el callback inicialmente
  callback(isMobile());

  // Escucha cambios en el tamaño de la ventana
  window.addEventListener("resize", () => {
    callback(isMobile());
  });
};
export const resetInput = (inputId) => {
  const searchBar = document.querySelector(`#${inputId}`);
  if (inputId) {
    searchBar.value = "";
  } else {
    console.error(
      `resetInput error: "${inputId}" is not a valid input on document`
    );
  }
};
