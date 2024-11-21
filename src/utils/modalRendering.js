import state from "./state.js";
import { insertFiltersModalLogic, renderFiltersModal } from "../components/filtersModal.js";
import { insertVoucherModalLogic, renderVoucherModal } from "../components/voucherModal.js";
import { renderSuccessModal } from "../components/successModal.js";
import { insertFailedModalLogic, renderFailedModal } from "../components/failedModal.js";

export const setupModals = () => {

  const openModalButtons = document.querySelectorAll('[data-modal-target]');
  const closeModalButtons = document.querySelectorAll('[data-modal-close]');

  openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modalId = button.getAttribute('data-modal-target');
      const modal = document.getElementById(modalId);
      if (modal) {
        const place = state.placesList.find(place => place.place_id === button.getAttribute("data-placeid"));
        addModalContent(modal, place);
        openModal(modal);
      }
    });
  });

  closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modalId = button.getAttribute('data-modal-close');
      const modal = document.getElementById(modalId);
      if (modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal') && !event.target.classList.contains('modal-content')) {
      closeModal(event.target);
    }
  });
}

export const openModal = (modal) => {
  modal.classList.remove('hidden');
}

export const closeModal = (modal) => {
  modal.classList.add('hidden');
}

const addModalContent = (modal, place, messages) => {
  const modalBody = modal.querySelector('#modal-body');
  const modalName = modalBody?.getAttribute("data-modal-name")
  // Render Modal
  if (modalName && modalName === "voucherModal") {
    modalBody.innerHTML = renderVoucherModal(place);
    insertVoucherModalLogic();
  }
  else if (modalName && modalName === "filtersModal") {
    modalBody.innerHTML = renderFiltersModal();
    insertFiltersModalLogic();
  }
  else if(modalName && modalName === "successModal") {
    modalBody.innerHTML = renderSuccessModal(place);
  }
  else if(modalName && modalName === "failedModal") {
    modalBody.innerHTML = renderFailedModal(messages);
    insertFailedModalLogic();
  }
}


export const openSuccessModal = () => {
  const modal = document.querySelector("#successModal");
  const place = state.placesList.find(place => place.place_id === state.selectedPlaceId);

  addModalContent(modal, place);
  openModal(modal);
}

export const openFailedModal = (messages) => {
  const modal = document.querySelector("#failedModal");
  addModalContent(modal, null, messages);
  openModal(modal);
}