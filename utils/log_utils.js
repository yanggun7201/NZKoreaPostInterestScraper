function log(...values) {
  console.log(new Date().toISOString(), ...values);
}

function errorLog(...values) {
  console.error(new Date().toISOString(), ...values);
}

module.exports = {
  log,
  errorLog,
}
