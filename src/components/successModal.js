export const renderSuccessModal = () => {
  return `
    <div class="w-[370px] h-[340px] bg-white absolute top-40 text-dark-gray flex flex-col items-center justify-center p-4 lg:w-[450px] lg:h-[340]">
      <figure class="w-24 mb-4">
        <img src="./src/assets/icons/cup-modal-icon.png" >
      </figure>
      <div class="flex flex-col justify-center items-center">
        <h2 class="text-lg font-semibold leading-5 mb-4 lg:text-xl">YOUR'RE ALL SET!</h2>
        <div class="text-center text-sm leading-4 mb-4">
          <p class="mb-4">We’ve sent your voucher to <span class="text-red-campari">{user.email}</span></p>
          <p>Check your inbox for your QR code and bring it to <span class="text-red-campari font-bold">{place.name}</span> to claim your free Campari Spritz!</p>
        </div>
        <a role="button" href="/" class="p-[8px] w-48 bg-red-campari text-white text-sm text-center hover:bg-light-red transition-all">GOT IT</a>
      </div>
    </div>
  `;
}