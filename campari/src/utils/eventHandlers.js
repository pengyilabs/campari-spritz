import { initMap } from "../components/map.js";
import state from "./state.js";

const distanceHandlerForDesktop = (e) => {
  state.distance = e.target.value;
  initMap();
}

const popularityHandler = (e) => {
  state.orderByPopularity = e.target.checked;
  initMap();
}

export const switchBarView = (view) => {
  const map = document.querySelector("#map");
  const barList = document.querySelector("#bar-list-mobile");
  const switchToMapButton = document.querySelector("#map-view-switcher");
  const switchToListButton = document.querySelector("#list-view-switcher");

  if(view === "map") {
    barList.style.display = "none";
    map.style.display = "block";
    switchToMapButton.classList.add("active-switch");
    switchToListButton.classList.remove("active-switch");
  } else {
    map.style.display = "none";
    barList.style.display = "block";
    switchToMapButton.classList.remove("active-switch");
    switchToListButton.classList.add("active-switch");
  }
}
window.distanceHandlerForDesktop = distanceHandlerForDesktop;
window.popularityHandler = popularityHandler;