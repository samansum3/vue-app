const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const multer = require('multer');

const db = admin.firestore();
const bucket = admin.storage().bucket();

const adminRoleId = 'adVNl0tA4SWhKphJd9bP';

const postCollection = 'posts';
const userCollection = 'users';
const postFolderPath = 'posts/';

const upload = multer({
    storage: multer.memoryStorage()
});

const { sendSuccess, sendError } = require('./util');

router.post('/post/create', upload.single('featureImage'), async (req, res) => {
    const post = req.body;
    const postData = {
        userId: req.session.uid,
        title: post.title,
        description: post.description,
        status: post.status,
        createDate: new Date()
    };
    try {
        db.collection(postCollection).add(postData).then(response => {
            //Upload feature image into firebase storage
            const blob = bucket.file(postFolderPath + response.id);
            const blobWriter = blob.createWriteStream({
                metadata: {
                    contentType: req.file.mimetype
                }
            });

            blobWriter.on('error', (err) => sendError(res, err));
            
            blobWriter.on('finish', async () => {
                postData.author = await getAuthorName(postData.userId);
                postData.updatable = true;
                postData.deletable = true;
                postData.description = null;
                sendSuccess(res, postData);
            });

            blobWriter.end(req.file.buffer);
        });
    } catch(error) {
        sendError(res, error);
    }
});

router.get('/post/get-all', async (req, res) => {
    try {
        const querySnapshot = await db.collection(postCollection).get();
        const posts = [];
        for (const doc of querySnapshot.docs) {
            posts.push(await getPost(req, doc));
        }
        sendSuccess(res, posts);
    } catch(error) {
        sendError(res, error);
    }
});

const getPost = async (req, doc) => {
    const post = doc.data();
    const updatable = hasUpdatePermission(req, post.userId);
    return {
        uid: doc.id,
        title: post.title,
        description: post.description,
        createDate: post.createDate?.toDate(),
        author: await getAuthorName(post.userId),
        updatable: updatable,
        deletable: updatable
    }
}

const hasUpdatePermission = async (req, authorId) => {
    return authorId == req.session.uid || await isAdmin(req);
}

const isAdmin = async (req) => {
    return adminRoleId == (await getUser(req.session.uid)).roleId;
}

const getAuthorName = async (uid) => {
    const user = await getUser(uid);
    return user.firstName + ' ' + user.lastName;
}

const getUser = async (uid) => {
    return (await db.collection(userCollection).doc(uid).get()).data();
}

const getImageUrl = async (filePath) => {
    try {
        const urls = await bucket.file(filePath).getSignedUrl({
            action: 'read',
            expires: new Date().getTime() + 1000 * 60 * 60 * 6
        });
        return urls[0];
    } catch(error) {
        return '';
    }
}

module.exports = router;