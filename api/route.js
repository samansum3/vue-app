const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();
const userCollection = 'users';

router.post('/user/create', (request, response) => {
    const user = request.body;
    db.collection(userCollection).doc(user.uid).set(user).then(result => {
        response.status(200).json(result);
    }).catch(error => sendError(response, error));
});

router.use('/user/get-all', (request, response) => {
    db.collection(userCollection).get().then(result => {
        const users = [];
        result.forEach(doc => users.push(getUser(doc)));
        response.status(200).json({success: true, result: users});
    }).catch(error => sendError(response, error));
});

router.use('/user/:userId', (request, response) => {
    db.collection(userCollection).doc(request.params.userId).get()
        .then(doc => response.status(200).json(getUser(doc.data())))
        .catch(console.error);
});

const sendError = (response, error) => {
    console.error(error);
    response.status(500).json({success: false});
}

const getUser = (doc) => {
    const user = doc.data();
    user.createDate = user.createDate?.toDate();
    user.lastLoginDate = user.lastLoginDate?.toDate();
    user.logoutDate = user.logoutDate?.toDate();
    user.modifiedDate = user.modifiedDate?.toDate();
    user.checked = false;
    return user;
}

module.exports = router;