const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();
const userCollection = 'users';
const rolesCollection = 'roles';
const userRoleCollection = 'users_roles';

router.get('/role/get', (reqeust, response) => {
    db.collection(rolesCollection).get().then(result => {
        const roles = [];
        result.forEach(doc => {
            roles.push({
                key: doc.id,
                value: doc.data().name
            });
        });
        response.status(200).json({success: true, result: roles});
    }).catch(error => sendError(response, error));
});

router.post('/user/create', (request, response) => {
    const user = request.body;
    admin.auth().createUser({
        email: user.emailAddress,
        password: user.password,
        emailVerified: false,
        displayName: user.firstName + ' ' + user.lastName,
        disabled: false
    }).then(userRecord => {
        const userData = {
            uid: userRecord.uid,
            firstName: user.firstName,
            lastName: user.lastName,
            screenName: user.firstName,
            emailAddress: user.emailAddress,
            createDate: new Date()
        };
        db.collection(userCollection).doc(userRecord.uid).set(userData).then(() => {
            userData.checked = false;
            userData.role = null; //TODO get user role id
            sendSuccess(response, userData);
        }).catch(error => sendError(response, error));
        db.collection(userRoleCollection).add({
            roleId: user.role,
            userId: userRecord.uid
        }).catch(error => sendError(response, error));
    }).catch(error => sendError(response, error));
});

router.post('/user/update', (request, response) => {
    const user = request.body;
    db.collection(userCollection).doc(user.uid).set({
        firstName: user.firstName,
        lastName: user.lastName
    }, {
        merge: true
    }).then(() => sendSuccess(response)).catch(error => sendError(response, error));
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

const sendSuccess = (response, data) => {
    response.status(200).json({success: true, result: data});
}

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
    user.role = null; //TODO get user role id
    return user;
}

module.exports = router;