const admin = require("firebase-admin");
const serviceAccount = require("../firebase-admin-auth.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: ''
});