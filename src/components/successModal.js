import state from "../utils/state.js";

export const renderSuccessModal = (place) => {
  return `
    <div class="result-modal-container">
      <figure class="result-modal-icon">
        <img src="./src/assets/icons/cup-modal-icon.png" >
      </figure>
      <div class="result-modal-content">
        <h2 class="result-modal-title">YOUR'RE ALL SET!</h2>
        <div class="result-modal-text">
          <p class="margin-bottom-p">We’ve sent your voucher to <span class="result-modal-email">${state.userEmail}</span></p>
          <p>Check your inbox for your QR code and bring it to <span class="result-modal-place-name">${place.name}</span> to claim your free Campari Spritz!</p>
        </div>
        <a role="button" href="/" class="result-modal-button">GOT IT</a>
      </div>
    </div>
  `;
}