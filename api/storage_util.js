const admin = require('firebase-admin');
const bucket = admin.storage().bucket();
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage()
});

const uploader = (field) => {
    return upload.single(field);
}

const uploadFile = (req, filePath) => {
    //Upload feature image into firebase storage
    return new Promise((resolve, reject) => {
        const blob = bucket.file(filePath);
        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        });
    
        blobWriter.on('error', (err) => reject(err));
        
        blobWriter.on('finish', resolve);
    
        blobWriter.end(req.file.buffer);
    });
}

const getImageUrl = async (filePath) => {
    try {
        const urls = await bucket.file(filePath).getSignedUrl({
            action: 'read',
            expires: new Date().getTime() + 1000 * 60 * 15
        });
        return urls[0];
    } catch(error) {
        return '';
    }
}

const deleteFile = async (filePath) => {
    await bucket.file(filePath).delete();
}

module.exports = {
    uploader,
    uploadFile,
    getImageUrl,
    deleteFile
}