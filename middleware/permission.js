const adminRoleId = 'adVNl0tA4SWhKphJd9bP'; //TODO refactor

const adminPermission = (userCollectionRef) => {
    return async (request, response, next) => {
        try {
            const userDoc = await userCollectionRef.doc(request.session.uid).get();
            if (adminRoleId === userDoc.data().roleId) {
                next();
            } else {
                response.status(200).json({success: false, message: 'Unauthorized role'});
            }
        } catch(error) {
            console.log(error);
            response.status(200).json({success: false, message: 'Unauthorized error'});
        }
    }
}

module.exports = adminPermission;