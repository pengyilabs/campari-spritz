import { clearListContainers } from "../utils/helpers.js";

export const drawLoadingSkeleton = () => {
  const barListDesktop = document.querySelector("#bar-list-desktop");
  const barListMobile = document.querySelector("#bar-list-mobile");

  clearListContainers([barListDesktop, barListMobile]);
  for(let i = 0; i < 4; i++) {
    barListDesktop.innerHTML += `
      <div class="skeleton-card">
        <div class="skeleton-info-container">
          <div class="skeleton-header"></div>
          <div class="skeleton-details"></div>
        </div>
        <div class="skeleton-image"></div>
      </div>
    `

    barListMobile.innerHTML += `
      <div class="skeleton-card">
        <div class="skeleton-info-container">
          <div class="skeleton-header"></div>
          <div class="skeleton-details"></div>
        </div>
        <div class="skeleton-image"></div>
      </div>
    `
  }
}