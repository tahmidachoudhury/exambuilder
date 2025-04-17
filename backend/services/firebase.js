const admin = require("firebase-admin")
const serviceAccount = require("./scripts/firebase-key.json")

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

const db = admin.firestore()

module.exports = db
