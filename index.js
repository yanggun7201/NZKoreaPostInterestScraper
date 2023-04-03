const { extractBody } = require("./utils/html_utils");
const { sendMessage } = require("./utils/message_utils");
const { log, errorLog } = require("./utils/log_utils");
const { requestURI } = require("./utils/http_utils");
const DBUtils = require("./utils/DBUtils");
const { isEmpty, trim } = require("lodash");
const { loadEnv } = require("./utils/env_utils");
loadEnv();

async function processTask(db, fcmToken, keyword) {

  try {
    const response = await requestURI(keyword);

    if (response.statusCode !== 200) {
      return;
    }

    const fcmMessages = [];

    await extractBody(response.body, async function (values) {
      const { postId, title, date, link } = values;

      try {
        const row = await db.getPostBy(postId, keyword, fcmToken);

        if (row) {
          return;
        }
        const params = [postId, title, keyword, date, link, fcmToken];
        const savedPost = await db.runInsertPost(params);
        log(`Data inserted into row ${savedPost.lastID}`);
        fcmMessages.push({ postId, title, link, date });
      } catch (error) {
        errorLog(error.message);
      }
    });

    if (fcmMessages.length > 0) {
      await sendMessage(fcmToken, keyword, fcmMessages);
    } else {
      log("_ No message sent");
    }

  } catch (error) {
    errorLog("error", error);
  }
}

async function main() {
  log("_______________ START _______________\n\n");
  const db = new DBUtils();

  try {
    loadEnv();
    const fcmDevices = JSON.parse(process.env.FCM_DEVICES);

    for (const device of fcmDevices.devices) {
      log("device", device);
      const fcmToken = device.fcmToken;
      if (isEmpty(trim(fcmToken))) {
        continue;
      }

      for (const keyword of device.keywords) {
        log("keyword", keyword);
        if (isEmpty(trim(keyword))) {
          continue;
        }
        await processTask(db, fcmToken, keyword);
      }
    }

  } catch (error) {
    errorLog("error", error);
  } finally {
    db.close();
    log("_______________ END _______________\n\n");
  }
}

main();


const retryTimeout = parseInt(process.env.RETRY_TIMEOUT_MINUTES || "5", 10) * 60;
log("RETRY_TIMEOUT_SECONDS", retryTimeout);

setInterval(main, retryTimeout * 1000);
