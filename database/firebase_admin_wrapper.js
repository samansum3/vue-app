const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.VUE_APP_FIREBASE_SECRET)),
  databaseURL: process.env.VUE_APP_FIREBASE_DB_URL,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET
});