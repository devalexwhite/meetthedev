module.exports = {
  content: [
    "./_site/**/*.{html,js}",
    "./_layouts/**/*.{html,js}",
    "./_includes/**/*.{html,js}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
