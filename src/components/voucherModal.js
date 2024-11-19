export const renderVoucherModal = (place) => {
  return `
      <div id="voucher-section" class="voucher-section">
        <img src="./src/assets/images/campari-logo.png" alt="Campari Logo" class="voucher-section__campari-logo">
        <h1 class="voucher-section__title">LOCK YOUR FREE <br class="md:hidden"> CAMPARI SPRITZ</h1>
        <p class="voucher-section__subtitle">ENTER YOUR EMAIL BELOW AND RECEIVE YOUR VOUCHER INSTANTLY</p>

        <div class="voucher-section__info">
          <h3 class="voucher-section__info-title">HOW EASY IT IS:</h3>
          <p class="voucher-section__info-description">Submit the participation form, and you're in the draw! The entry deadline is 28.02.2025.</p>
          <p class="voucher-section__info-age">Participation is for those aged 18 and above</p>
        </div>

        <div class="voucher-section__bar-item-container">
        <!-- Bar Item -->
          <div class="voucher-section__bar-item">
            <div class="bar-item__info-container">
              <h3 class="bar-item__title">${place.name || 'Bar Name'}</h3>
              <div class="bar-item__address-container flex gap-2">
                <img src="src/assets/icons/map-pin.svg" />
                <p class="bar-item__address-text">${place.formatted_address || 'Address not available'}</p>
              </div>
              <div class="bar-item__rating text-yellow-500 mb-2">
              ${place.rating || 'N/A'} ${'<img src="./src/assets/icons/star.svg" />'.repeat(Math.round(place.rating || 0))}
              </div>
              <p class="bar-item__is-opening">
                ${place.opening_hours?.isOpen() ?
                  '<span class="bar-item__is-opening__open">Open</span> - Closes 12:00 PM' :
                  `<span class="bar-item__is-opening__closed">Closed</span> - Opens 09:00 AM`}
              </p>
            </div>
            ${place.photos && 
              `<figure class="bar-item__bar-image-container">
                <img class="bar-item__bar-image-container_img" src=${place.photos[0]?.getUrl()} alt="Bar Image">
              </figure>`
            }
          </div>

        <!-- Form -->
          <form class="voucher-section__form-container">
            <label class="voucher-section__form-label">
              <figure class="voucher-section__input-icon">
                <img src="./src/assets/icons/user-icon.svg">
              </figure>
              <input type="text" id="firstNameInput" name="firstName" class="voucher-section__text-input" placeholder="Enter your name here">
            </label>

            <label class="voucher-section__form-label">
              <figure class="voucher-section__input-icon">
                <img src="./src/assets/icons/email-icon.svg">
              </figure>
              <input type="text" id="firstNameInput" name="email" class="voucher-section__text-input" placeholder="Enter your email here">
            </label>

            <div class="text-xs font-light leading-4 md:text-sm mt-4">
              <p>By submitting the form, I confirm that I have read and accepted the Terms and Conditions of the contest. The Privacy Policy was provided to me.</p>
              <p class="second-p">I also confirm that I would like to subscribe to the newsletter to receive exclusive news about events, offers, and promotions from Campari Deutschland GmbH and Davide Campari Milano N.V. I agree that Campari Deutschland GmbH and Davide Campari Milano N.V. may use my personal data to send messages according to my preferences or to personalize them based on my location. I understand that I can unsubscribe at any time via the unsubscribe link at the end of the newsletter</p>
            </div>

            <button trype="submit" id="claim-voucher-button" class="voucher-section__submit-button">CLAIM MY FREE DRINK</button>
          </form>
        </div>
        <span class="vouhcer-section__enjoyresponsibly">#ENJOYRESPONSIBLY</span>
      </div>  
    `;
}