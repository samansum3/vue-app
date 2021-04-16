const firebaseAuthentication = (admin) => {
    return (req, res, next) => {
        console.log('fireabse middleware is called');
        const sessionCookie = req.cookies.session || '';
        admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */).then(decodedClaims => {
            next();
        }).catch(error => {
            res.redirect('/login');
        });
    }
}

module.exports = firebaseAuthentication;