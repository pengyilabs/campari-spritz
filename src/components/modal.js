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

  if (modalName && modalName === "vouchersModal") {
    modalBody.innerHTML = `
      <h2 class="text-xl font-semibold mb-4 text-gray-600">Congratulations!</h2>
      <p class="text-gray-600">You have successfully claimed a voucher for your free drink. Please show this confirmation at the bar.</p>
    `;
  } else if (modalName && modalName === "filtersModal") {
    modalBody.innerHTML = `
      <h2 class="text-white text-lg font-semibold mb-4 mt-0 text-gray-600 font-rubik">FILTERS</h2>
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Distance</span>
        <span>{distance} miles</span>
      </div>
      <div className="relative">
        <input
          id="distanceInput"
          type="range"
          min="1"
          max="15"
          value={distance}
        />
    `;

    const distanceInput = document.querySelector("#distanceInput");
    distanceInput.addEventListener("change", (e) => {
      console.log(e.target.value);
    });
  }
}
