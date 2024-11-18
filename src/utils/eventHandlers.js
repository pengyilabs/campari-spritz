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

window.distanceHandlerForDesktop = distanceHandlerForDesktop;
window.popularityHandler = popularityHandler;