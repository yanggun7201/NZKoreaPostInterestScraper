const { errorLog, log } = require("./log_utils");
const sqlite3 = require('sqlite3').verbose();
const dbFileName = 'mydata.db';

class DBUtils {
  constructor() {
    this.db = new sqlite3.Database(dbFileName);
    this.db.run('PRAGMA dialect = "sqlite"', (err) => {
      if (err) {
        errorLog(err.message);
      }
      log('SQLite dialect set successfully.');
    });
    this.db.run('CREATE TABLE IF NOT EXISTS mytable (id INTEGER PRIMARY KEY AUTOINCREMENT, postId INTEGER, title TEXT, keyword TEXT, date TEXT, link TEXT, fcmToken TEXT)', (err) => {
      if (err) {
        errorLog(err.message);
      }
      log('Table created successfully.');
    });
  }

  async getPostBy(postId, keyword, fcmToken) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM mytable WHERE postId = ? AND keyword = ? AND fcmToken = ?', [postId, keyword, fcmToken], function (err, row) {
        if (err) {
          return reject(err);
        }
        return resolve(row);
      });
    });
  }

  async runInsertPost(params) {
    return new Promise((resolve, reject) => {
      this.db.run('INSERT INTO mytable (postId, title, keyword, date, link, fcmToken) VALUES (?, ?, ?, ?, ?, ?)', params, function (err) {
        if (err) {
          return reject(err);
        }
        resolve(this);
      });
    });
  }

  close() {
    this.db.close();
  }
}

module.exports = DBUtils;
