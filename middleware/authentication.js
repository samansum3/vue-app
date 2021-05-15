const firebaseAuthentication = (admin) => {
    return (req, res, next) => {
        console.log('fireabse middleware is called');
        const sessionCookie = req.cookies.session || '';
        admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */).then(decodedClaims => {
            req.session.uid = decodedClaims.uid; //TODO fix session expiration instead
            next();
        }).catch(error => {
            res.status(200).json({success: false, message: 'Unauthorize'});
        });
    }
}

module.exports = firebaseAuthentication;