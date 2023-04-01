const cheerio = require("cheerio");

function extractPostId(link) {
  const postIdKey = "wr_id=";
  if (link.includes(postIdKey)) {
    const index = link.indexOf(postIdKey);
    if (index > -1) {
      return parseInt(link.substring(index + postIdKey.length).split("&")[0].trim(), 10);
    }
  }
  return -1;
}

async function extractBody(body, processCallback) {
  const $ = cheerio.load(body);
  const trs = $('#fboardlist .table-responsive > table > tbody > tr');

  for (const tr of trs) {
    const tdLength = $(tr).find('td').length;
    if (tdLength < 3) {
      // 광고
      return;
    }

    const link = $(tr).find(`td:eq(${tdLength - 2}) a`).attr('href').trim();
    const postId = extractPostId(link);
    const title = $(tr).find(`td:eq(${tdLength - 2}) a > strong`).text().trim();
    const lastTdContents = $(tr).find(`td:eq(${tdLength - 1})`)[0].children;
    let date = lastTdContents[lastTdContents.length - 1].data.trim();

    if (date.includes("오늘")) {
      date = date.replace("오늘", formatDate(new Date()));
    }

    await processCallback({ link, postId, title, date });
  } // for

}

function formatDate(date) {
  const formatter = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const parts = formatter.formatToParts(date);
  const year = parts.find(part => part.type === 'year').value;
  const month = parts.find(part => part.type === 'month').value;
  const day = parts.find(part => part.type === 'day').value;
  return `${year}.${month}.${day}`;
}


module.exports = {
  extractBody,
}