export const state = {
  distance: 3,
  subscribers: new Set(),
};

export function subscribe(callback) {
  state.subscribers.add(callback);
  return () => state.subscribers.delete(callback);
}

export function updateDistance(newDistance) {
  state.distance = newDistance;
  state.subscribers.forEach(callback => callback(state));
}