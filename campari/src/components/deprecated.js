const filterAndOrderPlaces = async (places, distance, orderByPopularity) => {
  // convert km to mts
  const maxDistance = distance * 1000;
  return await places
    .filter(place => place.radius <= maxDistance)
    .sort((a, b) => {
      if (orderByPopularity) {
        return b.rating - a.rating;
      } else {
        return a.radius - b.radius;
      }
    });
}