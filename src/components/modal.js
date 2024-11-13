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
      <div id="voucher-section" class="flex flex-col items-center p-4 min-h-screen w-screen text-white">
          <img src="./src/assets/images/campari-logo.png" alt="Campari Logo" class="mx-auto w-32 mb-4 md:w-60 md:my-6">
        <h1 class="text-[28px] leading-8 font-semibold mb-4 text-center md:text-5xl lg:text-7xl">LOCK YOUR FREE <br> CAMPARI SPRITZ</h1>
        <p class="text-base leading-5 mb-6 px-8  text-center md:text-2xl bold">ENTER YOUR EMAIL BELOW AND RECEIVE YOUR VOUCHER INSTANTLY</p>

        <div class="text-center text-sm leading-4">
          <h3 class="font-semibold">HOW EASY IT IS:</h3>
          <p class="font-light pb-4">Submit the participation form, and you're in the draw! The entry deadline is 28.02.2025</p>
          <p class="font-light">Participation is for those aged 18 and above</p>
        </div>

        <!-- Bar Item -->
        <div>
          <div class="bar-item mt-8">
            <div class="bar-item__info-container">
              <h3 class="bar-item__title">${state.place.name || 'Bar Name'}</h3>
              <div class="bar-item__address-container flex gap-2">
                <img src="src/assets/icons/map-pin.svg" />
                <p class="bar-item__address-text">${state.place.formatted_address || 'Address not available'}</p>
              </div>
              <div class="bar-item__rating text-yellow-500 mb-2">
              ${state.place.rating || 'N/A'} ${'<img src="./src/assets/icons/star.svg" />'.repeat(Math.round(state.place.rating || 0))}
              </div>
              <p class="bar-item__is-opening">
                ${state.place.opening_hours?.isOpen() ?
                  '<span class="bar-item__is-opening__open">Open</span> - Closes 12:00 PM' :
                  `<span class="bar-item__is-opening__closed">Closed</span> - Opens 09:00 AM`}
              </p>
              <button data-modal-target="voucherModal" class="bar-item__claim-voucher-button hover:bg-red-700">CLAIM VOUCHER</button>
            </div>
            <figure class="bar-item__bar-image-container">
              <img class="bar-item__bar-image-container_img" src=${state.place.photos[0]?.getUrl()} alt="Bar Image">
            </figure>
          </div>
        </div>

        <!-- Form -->
         <form class="mt-8 w-full relative flex flex-col gap-4">
          <label class="relative">
            <figure class="absolute left-4 top-[35%]">
              <img src="./src/assets/icons/user-icon.svg">
            </figure>
            <input type="text" id="firstNameInput" name="firstName" class="text-dark-gray w-full p-4 pl-12" placeholder="Enter your first name here">
          </label>

          <label class="relative">
            <figure class="absolute left-4 top-[35%]">
              <img src="./src/assets/icons/email-icon.svg">
            </figure>
            <input type="text" id="firstNameInput" name="email" class="text-dark-gray w-full p-4 pl-12" placeholder="Enter your email here">
          </label>

          <div class="text-xs font-light leading-4 md:text-sm mt-8">
            <p>By submitting the form, I confirm that I have read and accepted the Terms and Conditions of the contest. The Privacy Policy was provided to me.</p>
            <p class="mt-4">I also confirm that I would like to subscribe to the newsletter to receive exclusive news about events, offers, and promotions from Campari Deutschland GmbH and Davide Campari Milano N.V. I agree that Campari Deutschland GmbH and Davide Campari Milano N.V. may use my personal data to send messages according to my preferences or to personalize them based on my location. I understand that I can unsubscribe at any time via the unsubscribe link at the end of the newsletter</p>
           </div>
  
           <button trype="submit" id="claim-voucher-button" class="bg-white text-red-700 px-12 py-4 mb-8 font-semibold hover:bg-red-200 transition duration-300 relative mt-4">CLAIM MY FREE DRINK</button>
         </form>
      </div>
    </div>
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
