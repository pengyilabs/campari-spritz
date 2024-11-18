import { getLocation } from "./helpers.js";

const state = {
  distance: 3,
  orderByPopularity: false,
  placesList: [],
  currentUserLocation: await getLocation()
}

export default state;