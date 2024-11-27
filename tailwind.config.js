/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*"],
  theme: {
    extend: {
      colors: {
        "red-campari": "#c8102e",
        "light-red": "#EA5D74",
        "dark-gray": "#2f2f2f",
        "dark-red": "#94041c",
        "light-green": "4DA166",
      },
      boxShadow: {
        "inner-custom": "inset 0 0px 8px rgba(0, 0, 0, 0.6)",
      },
    },
  },
};
