const admin = require("firebase-admin");
const { errorLog, log } = require("./log_utils");
const { loadEnv } = require("./env_utils");

loadEnv();

const serviceAccount = JSON.parse(process.env.FCM_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function sendMessage(fcmToken, searchKeyword, fcmMessages) {
  console.log(`_________________ sendMessage keyword:${searchKeyword}, size:${fcmMessages.length} _________________`);
  return new Promise((resolve, reject) => {
    const items = fcmMessages.splice(0, 5);
    const message = {
      notification: {
        title: searchKeyword,
        body: `${items.length} 건 발견`,
      },
      data: {
        items: JSON.stringify(items),
        click_action: "FLUTTER_NOTIFICATION_CLICK",
        sound: "default",
      },
      token: fcmToken,
      // android: {
      //   notification: {
      //     clickAction: 'FLUTTER_NOTIFICATION_CLICK',
      //   },
      // }
    };

    admin.messaging().send(message)
      .then((response) => {
        log('Message sent:', response);
        resolve();
      })
      .catch((error) => {
        errorLog('Error sending message:', error);
        reject();
      });
  });
}

module.exports = {
  sendMessage,
}
