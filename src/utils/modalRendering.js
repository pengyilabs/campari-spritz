import state from "./state.js";
import { insertFiltersModalLogic, renderFiltersModal } from "../components/filtersModal.js";
import { renderVoucherModal } from "../components/voucherModal.js";
import { renderSuccessModal } from "../components/successModal.js";

export function setupModals() {

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

function openModal(modal) {
  modal.classList.remove('hidden');
}

function closeModal(modal) {
  modal.classList.add('hidden');
}

function addModalContent(modal, place) {
  const modalBody = modal.querySelector('#modal-body');
  const modalName = modalBody?.getAttribute("data-modal-name")

  /* VOUCHER MODAL */
  if (modalName && modalName === "voucherModal") {
    modalBody.innerHTML = renderVoucherModal(place);
  }
  /* FILTERS MODAL */
  else if (modalName && modalName === "filtersModal") {
    modalBody.innerHTML = renderFiltersModal();
    insertFiltersModalLogic();
  }
  /* SUCCESS MODAL */
  else if(modalName && modalName === "successModal") {
    modalBody.innerHTML = renderSuccessModal();
  }
}
