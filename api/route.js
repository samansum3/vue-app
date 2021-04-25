const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();
const userCollection = 'users';
const rolesCollection = 'roles';

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

router.post('/user/create', async (request, response) => {
    const user = request.body;
    try {
        const ceator = request.session.uid;
        const userRecord = await admin.auth().createUser({
            email: user.emailAddress,
            password: user.password,
            emailVerified: false,
            displayName: user.firstName + ' ' + user.lastName,
            disabled: false
        });

        const userData = {
            uid: userRecord.uid,
            firstName: user.firstName,
            lastName: user.lastName,
            screenName: user.firstName,
            emailAddress: user.emailAddress,
            roleId: user.role,
            createDate: new Date(),
            ceatedBy: ceator
        };
        await db.collection(userCollection).doc(userRecord.uid).set(userData);

        const roleDoc = await db.collection(rolesCollection).doc(user.role).get();

        userData.role = roleDoc.id;
        userData.roleName = roleDoc.data().name;
        userData.checked = false;

        sendSuccess(response, userData);
    } catch(error) {
        sendError(response, error);
    }
});

router.post('/user/update', (request, response) => {
    const user = request.body;
    db.collection(userCollection).doc(user.uid).set({
        firstName: user.firstName,
        lastName: user.lastName,
<<<<<<< Updated upstream
        roleId: user.role
=======
        roleId: user.role.id,
        modifiedDate: new Date()
>>>>>>> Stashed changes
    }, {
        merge: true
    }).then(() => sendSuccess(response)).catch(error => sendError(response, error));
});

router.delete('/user/delete', async (request, response) => {
    const uid = request.body.uid;
    try {
        await admin.auth().deleteUser(uid);
        await db.collection(userCollection).doc(uid).delete();
        sendSuccess(response);
    } catch(error) {
        sendError(response, error);
    }
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