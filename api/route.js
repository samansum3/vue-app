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

router.use('/user/get-all', async (request, response) => {
    try {
        const querySnapshot = await db.collection(userCollection).get();
        const users = [];
        for (const doc of querySnapshot.docs) {
            users.push(await getUser(doc));
        }
        response.status(200).json({success: true, result: users});
    } catch(error) {
        sendError(response, error);
    }
});

router.use('/user/:userId', (request, response) => {
    db.collection(userCollection).doc(request.params.userId).get()
        .then(async doc => response.status(200).json(await getUser(doc.data())))
        .catch(console.error);
});

const sendSuccess = (response, data) => {
    response.status(200).json({success: true, result: data});
}

const sendError = (response, error) => {
    console.error(error);
    response.status(500).json({success: false});
}

const getUser = async (doc) => {
    const user = doc.data();
    const roleDoc = await db.collection(rolesCollection).doc(user.roleId).get();
    
    user.createDate = user.createDate?.toDate();
    user.lastLoginDate = user.lastLoginDate?.toDate();
    user.logoutDate = user.logoutDate?.toDate();
    user.modifiedDate = user.modifiedDate?.toDate();
    user.checked = false;
    user.role = roleDoc.id;
    user.roleName = roleDoc.data().name;
    return user;
}

module.exports = router;