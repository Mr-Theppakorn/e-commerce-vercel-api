
var admin = require("firebase-admin");

var serviceAccount = require("../config/firebase.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fastfood-1b190-default-rtdb.asia-southeast1.firebasedatabase.app"
});

module.exports = admin;
