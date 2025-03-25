import state from "../utils/state.js";
import { openFailedModal, openSuccessModal } from "../utils/modalRendering.js";
import {formatName, validateName, validateEmail, calculateOpeningHour, calculateClosingHour} from "../utils/helpers.js";
import ENVIRONMENT from "../../env.Development.js";

export const renderVoucherModal = (place) => {
  const openingHour = calculateOpeningHour(place.openingHours);
  const closingHour = calculateClosingHour(place.openingHours);
  state.selectedPlaceId = place.placeId;

  return `
      <div id="voucher-section" class="voucher-section">
        <img src="./src/assets/images/sarti-logo.png" alt="Sarti Logo" class="voucher-section__campari-logo">
        <h1 class="voucher-section__title">SICHERE DIR DEINEN <br class="md:hidden"> GRATIS SARTI SPRITZ</h1>
        <p class="voucher-section__subtitle">TRAGE DEINE E-MAIL EIN UND ERHALTE DEINEN GUTSCHEIN SOFORT</p>

        <div class="voucher-section__info">
          <h3 class="voucher-section__info-title">SO EINFACH GEHT'S:</h3>
          <p class="voucher-section__info-description">Reiche das Teilnahmeformular ein und nimm an der Verlosung teil! Einsendeschluss ist <b>28.02.2025.</b></p>
          <p class="voucher-section__info-age">Teilnahme ab 18 Jahren</p>
        </div>

        <div class="voucher-section__bar-item-container">
        <!-- Bar Item -->
          <div class="voucher-section__bar-item">
            <div class="bar-item__info-container">
              <h3 class="bar-item__title">${place.name || 'Bar Name'}</h3>
              <div class="bar-item__address-container flex gap-2">
                <img src="src/assets/icons/map-pin.svg" />
                <p class="bar-item__address-text">${place.formattedAddress || 'Adresse nicht verfügbar'}</p>
              </div>
              <div class="bar-item__rating text-yellow-500 mb-2">
              ${place.rating || 'N/A'} ${'<img src="./src/assets/icons/star.svg" />'.repeat(Math.round(place.rating || 0))}
              </div>
              <p class="bar-item__is-opening">
                ${place.isOpen ?
                  `<span class="bar-item__is-opening__open">Open</span> - Closes ${closingHour}` :
                  `<span class="bar-item__is-opening__closed">Closed</span> - Opens ${openingHour}`}
              </p>
            </div>
            ${place.photoUrl && 
              `<figure class="bar-item__bar-image-container">
                <img class="bar-item__bar-image-container_img" src=${place.photoUrl} alt="Bar Image">
              </figure>`
            }
          </div>

        <!-- Form -->
          <form id="voucherForm" class="voucher-section__form-container">
            <label class="voucher-section__form-label">
              <figure class="voucher-section__input-icon">
                <img src="./src/assets/icons/user-icon.svg">
              </figure>
              <input type="text" id="firstNameInput" name="firstName" class="voucher-section__text-input" placeholder="Gib hier deinen Namen ein">
            </label>
            <label class="voucher-section__form-label">
              <figure class="voucher-section__input-icon">
                <img src="./src/assets/icons/email-icon.svg">
              </figure>
              <input type="email" id="emailInput" name="email" class="voucher-section__text-input" placeholder="Gib hier deine E-Mail ein">
            </label>

            <div class="text-xs font-light leading-4 md:text-sm mt-4">
              <p>Mit dem Absenden des Formulars bestätige ich, die Teilnahmebedingungen der Maßnahme gelesen und akzeptiert zu haben. Die Datenschutzrichtlinie wurde mir zur Verfügung gestellt.</p>
              <p class="second-p">Ich bestätige außerdem, dass ich den Newsletter abonnieren möchte, um exklusive Neuigkeiten zu Events, Angeboten und Aktionen von Sarti Deutschland GmbH und Davide Sarti Milano N.V. zu erhalten. Ich stimme zu, dass Sarti Deutschland GmbH und Davide Sarti Milano N.V. meine persönlichen Daten nutzen dürfen, um Nachrichten entsprechend meiner Vorlieben zu senden oder diese basierend auf meinem Standort zu personalisieren. Ich verstehe, dass ich mich jederzeit über den Abmeldelink am Ende des Newsletters abmelden kann.</p>
            </div>

            <label class="voucher-section__terms-of-services-label">
            <input type="checkbox" id="terms-checkbox" class="checkbox voucher-section__checkbox" checked /> I accept the new Terms of Services
            </label>
            <button type="submit" id="claim-voucher-button" class="voucher-section__submit-button">HOL DIR DEIN GRATISGETRÄNK</button>
          </form>
        </div>
        <span class="voucher-section__enjoyresponsibly">#ENJOYRESPONSIBLY</span>
      </div>  
    `;
}

export const insertVoucherModalLogic = () => {
  const form = document.querySelector("#voucherForm");
  if (!form) return;

  const termsCheckbox = document.querySelector("#terms-checkbox");
  const submitButton = document.querySelector("#claim-voucher-button");

  termsCheckbox.addEventListener("input", () => {
    termsCheckbox.checked
    ? submitButton.disabled = false
    : submitButton.disabled = true;
  })

  form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const { name, email } = getFormData(event.target);
      if (!validateForm(name, email)) return;

      const payload = createPayload(name, email);
      const response = await sendRequest(payload);

      handleResponse(response);
  });
};

const getFormData = (form) => {
  return {
      name: formatName(form.firstName.value),
      email: form.email.value.trim(),
  };
}

const validateForm = (name, email) => {
  const nameInput = document.querySelector("#firstNameInput");
  const emailInput = document.querySelector("#emailInput");

  const isNameValid = validateName(name);
  const isEmailValid = validateEmail(email);

  const originalNamePlaceholder = nameInput.placeholder;
  const originalEmailPlaceholder = emailInput.placeholder;

  // Change placeholder message and color if text inputs are not valid
  if (!isNameValid) {
    nameInput.value = "";
    nameInput.placeholder = "You must insert a name";
    nameInput.classList.add("failed-name-input", "placeholder-red");

    nameInput.addEventListener("input", (e) => {
        e.target.placeholder = originalNamePlaceholder;
        e.target.classList.remove("failed-name-input", "placeholder-red");
    });
  }
  if (!isEmailValid) {
    emailInput.value = "";
    emailInput.placeholder = "The email format is invalid";
    emailInput.classList.add("failed-email-input", "placeholder-red");

    // Recover original placeholder when the user input data
    emailInput.addEventListener("input", (e) => {
      e.target.placeholder = originalEmailPlaceholder;
      e.target.classList.remove("failed-email-input", "placeholder-red");
    });
  }

  return isNameValid && isEmailValid;
}

const createPayload = (name, email) => {
  return {
      name,
      email,
      placeId: state.selectedPlaceId,
  };
}

const sendRequest = async (payload) => {
  return fetch(ENVIRONMENT.CAMPARI_SUBSCRIPTION_URL, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
  });
}

const handleResponse = async (response) => {
  if (response.ok) {
      const data = await response.json();
      state.userEmail = data.email;
      openSuccessModal();
  } else {
      const errorMessages = await generateErrorMessages(response);
      console.log(errorMessages);
      openFailedModal(errorMessages);
  }
}

const generateErrorMessages = async (response) => {
  if (response.status === 409) {
      return ["Die eingegebene E-Mail hat bereits einen Gutschein für diese Bar"];
  }
  if (response.status === 406) {
      return ["Die eingegebene E-Mail wurde blockiert"];
  }
  if (response.status === 422) {
      return ["Die eingegebene E-Mail kann nicht zugestellt werden"];
  }

  const error = await response.json();
  console.error("Error response:", error);

  return [
      'Unbekannter Fehler. Bitte sende eine Nachricht an <span class="message-error-email">support@gratis-spritz.com</span>, teile uns den Fehler mit, und wir helfen dir, deinen Gutschein zu erhalten.',
  ];
}