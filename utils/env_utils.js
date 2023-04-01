function loadEnv() {
  require('dotenv').config({ override: true });
}

module.exports = {
  loadEnv,
}