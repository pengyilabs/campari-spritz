import state from "../utils/state.js";

export const renderSuccessModal = (place) => {
  return `
    <div class="result-modal-container">
      <figure class="result-modal-icon">
        <img src="./src/assets/icons/cup-modal-icon.png" >
      </figure>
      <div class="result-modal-content">
        <h2 class="result-modal-title">LOS GEHT'S!</h2>
        <div class="result-modal-text">
          <p class="margin-bottom-p">Wir haben deinen Gutschein gesendet an <span class="result-modal-email">${state.userEmail}</span></p>
          <p>Check deine Inbox für deinen QR-Code und bring ihn mit zu <span class="result-modal-place-name">${place.name}</span> um deinen kostenlosen Campari Spritz zu erhalten!</p>
        </div>
        <a role="button" href="/" class="result-modal-button">GOT IT</a>
      </div>
    </div>
  `;
}