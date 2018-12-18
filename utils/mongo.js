const { MongoClient } = require('mongodb');
const config = require('../../config.json');

const url = config.mongodb.url;

class MongoInstance {
  constructor() {
    this.db = null;
    this.status = false;
  }

  connect() {
    if (this.status === true) {
      console.log("MongoDB already connected.");
      return;
    }
    console.log("MongoDB connecting...");
    return MongoClient.connect(url, { useNewUrlParser: true }).then(db => {
      console.log("MongoDB connect successful.");
      this.db = db;
      this.status = true;
    }, err => {
      console.log(err);
      throw new Error('MongoDB connect failed.')
    })
  }

  close() {
    if (this.status === false) {
      console.log("MongoDB already closed.");
      return;
    }

    this.db.close((err, res) => {
      if (err === null) {
        console.log("MongoDB close successful.");
        this.db = null;
        this.status = false;
      } else {
        console.log("MongoDB close failed.");
      }
    });
  }
}

module.exports = new MongoInstance();
