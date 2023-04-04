function log(...values) {
  console.log(getDateTime(), ...values);
}

function errorLog(...values) {
  console.error(getDateTime(), ...values);
}

function getDateTime() {
  return new Date().toLocaleString('ko-KR', { timeZone: 'Pacific/Auckland' });
}

module.exports = {
  log,
  errorLog,
}
