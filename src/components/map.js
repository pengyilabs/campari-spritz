import {
  validateIsOpen,
  calculateClosingHour,
  calculateOpeningHour,
  checkCachedData,
  clearListContainers,
  persistData,
} from "../utils/helpers.js";
import state from "../utils/state.js";
import {drawLoadingSkeleton} from "./loading-skeleton.js";
import {setupModals} from "../utils/modalRendering.js";
import ENVIRONMENT from "../../env.Development.js";

const fetchPlaceDetails = async (service, placeIds) => {
  const { spherical } = await google.maps.importLibrary("geometry");
  const result = await fetch(ENVIRONMENT.CAMPARI_PLACES_DETAILS_URL);
  const data = await result.json();

  if (!checkCachedData(data)) {
    persistData("placesDetailsBE", data);
  }
  // const cachedData = retrieveData("placesDetailsBE");
  const updatedPlacesList = data.map((place) => {
    let loc = {
      lat: place.lat,
      lng: place.long
    }
    place.radius = spherical.computeDistanceBetween(
        state.currentUserLocation,
        loc
    );
    place.photo = place.photoUrl;
    place.isOpen = validateIsOpen(place.openingHours);
    place.updatedDate = Date.now();
    return place;
  });

  persistData("placesDetails", updatedPlacesList);
  return updatedPlacesList;
};


/* A version that filters by distance and popularity is available on deprecated.js file */
const filterAndOrderPlaces = async (places) => {
  return await places.sort((a, b) => {
    return a.radius - b.radius;
  });
};

// Create bar items for each place id
const createHtmlPlacesList = (places) => {
  const htmlPlaces = places.map((place) => {
    const openingHour = calculateOpeningHour(place.openingHours);
    const closingHour = calculateClosingHour(place.openingHours);

    const open = place.isOpen === true && typeof place.isOpen === "boolean";
    const closed = place.isOpen === false && typeof place.isOpen === "boolean";
    const unkownOpening =
      place.isOpen === null && typeof place.isOpen === "object";

    return `
      <div class="bar-item">
        <div class="bar-item__info-container">
          <h3 class="bar-item__title">${place.name || "Bar Name"}</h3>
          <div class="bar-item__address-container flex gap-2">
            <img src="src/assets/icons/map-pin.svg" />
            <p class="bar-item__address-text">${
              place.formattedAddress || "Address not available"
            }</p>
          </div>
          <div class="bar-item__rating text-yellow-500 mb-2">
          ${
            place.rating || "N/A"
          } ${'<img src="./src/assets/icons/star.svg" />'.repeat(
      Math.round(place.rating || 0)
    )}
          </div>
          <p class="bar-item__is-opening">
            ${
              open
                ? `<span class="bar-item__is-opening__open">Open</span> - Closes ${closingHour}`
                : ""
            }
            ${
              closed
                ? `<span class="bar-item__is-opening__closed">Closed</span> - Opens ${openingHour}`
                : ""
            }
            ${
              unkownOpening
                ? `<span class="bar-item__is-opening__unknown">Unkown opening hours</span>`
                : ""
            }
          </p>
          <button data-modal-target="voucherModal" data-placeid=${
            place.placeId
          } class="bar-item__claim-voucher-button hover:bg-light-red transition-all">GUTSCHEIN EINLÖSEN</button>
        </div>
        <figure class="bar-item__bar-image-container">
          <img class="bar-item__bar-image-container_img" src=${
            place.photo
          } alt="Bar Image">
        </figure>
      </div>
    `;
  });

  if (places.length === 0) {
    htmlPlaces.push(`
      <div class="bars-not-found">
        <h2 class="bars-not-found__title">Wir konnten keine Bars in deiner Nähe finden ;(</h2>
        <p class="bars-not-found__description">Versuche eine andere Location oder erhöhe die maximale Entfernung.</p>
      </div>
    `);
  }

  return htmlPlaces;
};

const createMarkers = (places, map) => {
  places.forEach((place) => {
    createMarker(place, map);
  });
};

const createMarker = (place, map) => {
  if (!place.lat || !place.long) return;

  const markerContent = document.createElement("div");
  markerContent.className = "custom-marker";
  markerContent.innerHTML = `
    <img src="./src/assets/images/map-marker.svg" alt="${place.name}" style="width: 32px; height: 32px;" />
  `;

  let loc = {
    lat: place.lat,
    lng: place.long
  }
  const marker = new google.maps.marker.AdvancedMarkerElement({
    map: map,
    position: loc,
    title: place.name,
    content: markerContent,
  });

  let photoUrl = place.photoUrl;
  // if (place.photos) {
  //   photoUrl = place.photo;
  // }

  const infoWindowContent = `
    <div class="info-window-container">
      <button id="claimVoucherButton" data-modal-target="voucherModal" data-placeid="${
        place.placeId
      }" 
        class="info-window-button">
        GUTSCHEIN EINLÖSEN
      </button>
      ${
        photoUrl !== ""
          ? `
        <figure class="info-window-image-container">
          <img src="${photoUrl}" class="info-window-image" alt="${place.name}" />
        </figure>
      `
          : ""
      }
      <h3 class="info-window-title">${place.name}</h3>
      <p>${place.vicinity || ""}</p>
      <div class="info-window-rating">
        ${
          place.rating
            ? `<p>Rating: ${place.rating}</p><img src="./src/assets/icons/star.svg" alt="Star" />`
            : ""
        }
      </div>
    </div>
  `;

  const infoWindow = new google.maps.InfoWindow({
    content: infoWindowContent,
    maxWidth: 300,
  });

  marker.addListener("click", async () => {
    await infoWindow.open({
      anchor: marker,
      map,
    });
    setupModals();
  });
};

export const initMap = async () => {
  try {
    const { lat, lng } = await state.currentUserLocation;
    const mapElement = document.getElementById("map");
    if (!mapElement) {
      console.error("Map element not found");
      return;
    }

    const resizeMap = () => {
      const isMobile = window.innerWidth < 1024;
      // calc values: (device height - header height - collapsed bar list distance from the bottom)
      mapElement.style.height = isMobile ? "calc(100vh - 390px - 15%)" : "100%";
    };

    window.addEventListener("resize", resizeMap);
    resizeMap();

    const mapOptions = {
      center: { lat: lat(), lng: lng() },
      zoom: 14,
      mapId: ENVIRONMENT.MAP_ID,
      gestureHandling: "greedy"
    };

    const map = new google.maps.Map(mapElement, mapOptions);

    new google.maps.marker.AdvancedMarkerElement({
      position: { lat: lat(), lng: lng() },
      map: map,
      title: "Your location",
    });

    drawLoadingSkeleton();
    const barListMobile = document.querySelector("#bar-list-mobile");
    const barListDesktop = document.querySelector("#bar-list-desktop");


    // Get all place id infos including image url
    state.placesList = await fetchPlaceDetails();
    const orderedPlacesList = await filterAndOrderPlaces(
      state.placesList
    );
    clearListContainers([barListMobile, barListDesktop]);
    const htmlPlacesList = createHtmlPlacesList(orderedPlacesList);

    barListMobile.insertAdjacentHTML("beforeend", htmlPlacesList.join(""));
    barListDesktop.insertAdjacentHTML("beforeend", htmlPlacesList.join(""));

    createMarkers(orderedPlacesList, map);
    setupModals();
  } catch (error) {
    console.error("Error initializing the map:", error);
  }
};
