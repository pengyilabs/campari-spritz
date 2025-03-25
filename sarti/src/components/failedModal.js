export const renderFailedModal = (messages) => {
  return `
    <div class="result-modal-container">
      <div class="result-modal-content">
        <figure class="result-modal-icon">
          <img src="./src/assets/icons/cross.png" />
        </figure>
        <h2 class="result-modal-title">DAS HAT LEIDER NICHT FUNKTIONIERT</h2>
        <div class="result-modal-text error ${messages.length > 1 ? "align-start" : ""}">
          ${messages.map(msg => `<p class="error-msg">${messages.length > 1 ? "*" : ""}${msg}</p>`).join("")}
        </div>
        <button id="result-modal-button" class="result-modal-button">GOT IT</button>
      </div>
    </div>
  `;
}

export const insertFailedModalLogic = () =>  {
  const button = document.querySelector("#result-modal-button");

  button.addEventListener("click", () => {
    const failedModal = document.querySelector("#failedModal");
    failedModal.classList.add("hidden");
  })
}