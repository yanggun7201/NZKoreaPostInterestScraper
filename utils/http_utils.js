const request = require('request');

async function requestURI(searchKeyword) {
  return new Promise((resolve, reject) => {
    const searchURI = `https://www.nzkoreapost.com/bbs/board.php?bo_table=market_buynsell&sca=&sop=and&sfl=wr_subject%7C%7Cwr_content&stx=${encodeURIComponent(searchKeyword)}`;
    request(searchURI, async function (error, response, body) {
      if (error) {
        reject(error);
      }
      resolve({
        statusCode: response.statusCode,
        body,
      });
    });
  });
}

module.exports = {
  requestURI,
}
