import state from "../utils/state.js";
import { initMap } from "./map.js";

export const renderFiltersModal = () => {
  return `
    <h2 class="text-white text-lg font-semibold mb-4 text-gray-600 font-rubik">FILTERS</h2>
    <div class="w-full space-y-2 pt-8 font-roboto-condensed">
      <div class="flex justify-between text-base  text-base">
        <span>Distance</span>
        <span><span id="distanceLabel">${state.distance}</span> km</span>
      </div>
      <div class="w-full">
        <input
          id="distanceInput"
          class="distance-input-range w-full"
          type="range"
          min="1"
          max="15"
          value=${state.distance}
        />
      </div>

      <div>
      <p class="text-base mt-8">Popularity</p>
      <div class="flex justify-between">
        <p class="text-sm mt-4">Order by popularity</p>
        <input type="checkbox" class="checkbox" id="orderByPopularityCheckboxMobile" ${state.orderByPopularity === true && "checked"}/>
      </div>
    </div>
  `;
}

export const insertFiltersModalLogic = () => {
  const distanceInput = document.querySelector("#distanceInput");
  const distanceLabel = document.querySelector("#distanceLabel");
  const orderByPopularityCheckbox = document.querySelector("#orderByPopularityCheckboxMobile");

  // Add event to distance input
  distanceInput.addEventListener("change", (e) => {
    state.distance = e.target.value;
    distanceLabel.textContent = e.target.value;
    initMap();
  });

  // Add event to orderByPopularity checkbox
  orderByPopularityCheckbox.addEventListener("change", (e) => {
    state.orderByPopularity = e.target.checked;
    initMap();
  })
}