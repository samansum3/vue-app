const express = require('express');
const serverStatic = require('serve-static');
const path = require('path');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const csrf = require('csurf');

require('dotenv').config();

const connectToMongodb = require('./database/mongodb');
const environment = require('./config/environment');
const invoice = require('./model/invoice');
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
const roleCollection = 'roles';


//connect to db
connectToMongodb();


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

const router = require('./api/route');
app.use('/api', router);

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

app.post('/invoice/create', (request, response) => {
    const form = request.body;
    const document = new invoice({
        sellerName: form.sellerName,
        customerName: form.customerName,
        products: form.products
    });
    document.save((error, doc) => {
        if (error) {
            console.log('ERROR ' + error);
            response.status(500).json({message: 'Failed to save the invoice.'});
        } else {
            console.log(doc);
            response.status(200).json({message: 'Invoice is saved.', id: doc._id});
        }
    });
});

app.get('/invoice/get-all', firebaseAuthentication(admin), (request, response) => {
    invoice.find((error, docs) => {
        if (error) {
            sendError(response, error, 500, 'Failed to get invoices');
        } else {
            console.log('Get all invoice docs successfully.');
            response.status(200).json(docs);
        }
    });
});

app.get('/invoice/get/:id', (request, response) => {
    const id = request.params.id;
    invoice.findById(id, (error, doc) => {
        if (error) {
            sendError(response, error, 'Failed to get invoices.');
        } else {
            console.log("Get invoice successfully.");
            response.status(200).json(doc);
        }
    });
});

app.put('/invoice/update', (request, response) => {
    const id = request.body.id;
    const document = request.body;
    invoice.findByIdAndUpdate(id, document, (error, doc) => {
        if (error) {
            sendError(response, error, 500, 'Failed to update invoice.');
        } else {
            console.log('Updated invoice successfully');
            response.status(200).json(doc);
        }
    });
});

app.delete('/invoice/delete', (request, response) => {
    invoice.findByIdAndDelete(request.query.id, (error, doc) => {
        if (error) {
            sendError(response, error, 500, 'Failed to delete invoice.');
        } else {
            console.log('Invoice was deleted successfully');
            response.status(200).json(doc);
        }
    });
});

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