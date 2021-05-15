const express = require('express');
const serverStatic = require('serve-static');
const path = require('path');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const csrf = require('csurf');

//Load environment variable from .env
require('dotenv').config();

const environment = require('./config/environment');
const firebaseAuthentication = require('./middleware/authentication');

const app = express();

//TODO refactor
const userRole = {
    admin: 'adVNl0tA4SWhKphJd9bP',
    user: '4O3c5MDTj6hS60GmKWr0'
}

//Prevent cross site attack
app.use(cors({
    origin: [
        process.env.VUE_APP_PRODUCTION_URL
    ],
    credentials: true,
    exposedHeaders: ['set-cookie']
}));

//initialize firebase admin app
require('./database/firebase_admin_wrapper');

const db = admin.firestore();
const userCollection = 'users';

//User body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrf({ cookie: true }));

const expiresIn = 60 * 60 * 6 * 1000;

app.enable('trust proxy');
app.use(session({
    secret: process.env.VUE_APP_SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    proxy : true,
    unset: 'destroy',
    cookie: {
        maxAge: expiresIn,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
    }
}));

app.all('*', (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});

app.use('/api/*', firebaseAuthentication(admin));

app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') {
        return next(err);
    } else {
        res.status(403);
        res.send('');
    }
});

//TODO Combine these routers
const router = require('./api/route');
const postRouter = require('./api/post');

app.use('/api', router);
app.use('/api', postRouter);

app.post('/session_login', async (request, response) => {
    const idToken = request.body.idToken;

    try {
        const authUser = await admin.auth().verifyIdToken(idToken, true);
        const user = (await db.collection(userCollection).doc(authUser.uid).get()).data();

        if (user.roleId === userRole.user || user.roleId === userRole.admin) { //Make sure that only created user can login
            admin.auth().createSessionCookie(idToken, { expiresIn }).then(sessionCookie => {
                request.session.uid = user.uid;

                // Set cookie policy for session cookie.
                const options = { maxAge: expiresIn, httpOnly: true, secure: true };
                response.cookie('session', sessionCookie, options);
                response.end(JSON.stringify({ status: 'success' }));
            }, (error) => {
                sendError(response, error, 401, 'Unauthorized request');
            });
        } else {
            sendError(response, 'The user was created unauthorized' + JSON.stringify(user), 401, 'Unauthorized');
        }
    } catch(error) {
        sendError(response, error, 500, 'Cannot log in');
    }
});

app.post('/session_logout', (request, response) => {
    response.clearCookie('session');
    request.session.destroy(error => {
        if (error) {
            console.log(error);
            request.session = null;
        }
    });
    response.status(200).json({success: true});
});

app.get('/auth_check', firebaseAuthentication(admin), (request, response) => {
    response.status(200).json({success: true});
});

const sendError = (response, error, status, message) => {
    console.log('ERROR ' + error);
    response.status(status).json({success: false, message: message});
    // response.redirect('/');
}

//Serve vue app
app.use('/', serverStatic(path.join(__dirname, 'dist')));

app.use('/*', serverStatic(path.join(__dirname, 'dist')));

app.use('/.*/', (request, response) => {
    response.sendFile(path.join(__dirname, 'dist/index.html'));
});
//End serve vue app

app.listen(environment.server.port, environment.server.host, () => {
    console.log('Server started at %s on port %s', environment.server.host, environment.server.port);
});