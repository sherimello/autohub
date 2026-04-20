module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      // Suppress gradient direction warnings from Tailwind-generated CSS
      // which uses internal gradient syntax that triggers false positives
      overrideBrowserslist: ['> 1%', 'last 2 versions', 'not dead'],
    },
  },
};

