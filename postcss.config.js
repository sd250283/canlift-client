module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-nesting': {},
    '@tailwindcss/postcss': {},
    'postcss-preset-env': {
      features: { 'nesting-rules': false },
    },
  },
  autoprefixer: {},
  tailwindcss: {},
};
