const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const multer = require('multer');

const db = admin.firestore();
const bucket = admin.storage().bucket();

const postCollection = 'posts';
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