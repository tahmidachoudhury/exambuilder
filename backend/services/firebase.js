const admin = require("firebase-admin");
require("dotenv").config();

//parse firebase service from the .env, will need to be an env variable on DO
const serviceAccount = JSON.parse(process.env.FIREBASE_PRIVATE_KEY);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

module.exports = db;
