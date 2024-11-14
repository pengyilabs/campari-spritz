import state from "../utils/state.js";

export function setupModals() {
  // Get all buttons that can open modals
  const openModalButtons = document.querySelectorAll('[data-modal-target]');
  // Get all buttons that can close modals
  const closeModalButtons = document.querySelectorAll('[data-modal-close]');

  // Add click event listeners to open modal buttons
  openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modalId = button.getAttribute('data-modal-target');
      const modal = document.getElementById(modalId);
      if (modal) {
        addModalContent(modal, button);
        openModal(modal);
      }
    });
  });

  // Add click event listeners to close modal buttons
  closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modalId = button.getAttribute('data-modal-close');
      const modal = document.getElementById(modalId);
      if (modal) {
        closeModal(modal);
      }
    });
  });

  // Close modal if the user clicks outside the modal content
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal') && !event.target.classList.contains('modal-content')) {
      closeModal(event.target);
    }
  });
}

// Function to open a modal
function openModal(modal) {
  modal.classList.remove('hidden');
}

// Function to close a modal
function closeModal(modal) {
  modal.classList.add('hidden');
}

// Function to add dynamic content to the modal
function addModalContent(modal, button) {
  const modalBody = modal.querySelector('#modal-body');
  const modalName = modalBody?.getAttribute("data-modal-name")

  /*
  * VOUCHERS MODAL
  */
  if (modalName && modalName === "voucherModal") {
    modalBody.innerHTML = `
      
    `;
  }
  /*
  * FILTERS MODAL
  */
  else if (modalName && modalName === "filtersModal") {
    modalBody.innerHTML = `
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
          <input type="checkbox" class="checkbox" id="orderByPopularityCheckbox"/>
        </div>
      </div>
    `;

    const distanceInput = document.querySelector("#distanceInput");
    const distanceLabel = document.querySelector("#distanceLabel");
    const orderByPopularityCheckbox = document.querySelector("#orderByPopularityCheckbox");

    // Add event to distance input
    distanceInput.addEventListener("change", (e) => {
      state.distance = e.target.value;
      distanceLabel.textContent = e.target.value;
    });

    // Add event to orderByPopularity checkbox
    orderByPopularityCheckbox.addEventListener("change", (e) => {
      state.orderByPopularity = e.target.checked;
    })
  }
  /*
  * ALL SET MODAL
  */
}
