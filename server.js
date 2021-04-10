const express = require('express');
const serverStatic = require('serve-static');
const path = require('path');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
require('./database/firebase_admin_wrapper');

require('dotenv').config();

const connectToMongodb = require('./database/mongodb');
const environment = require('./config/environment');
const invoice = require('./model/invoice');

const app = express();

//initialize firebase admin app


//connect to db
connectToMongodb();

//User body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/', serverStatic(path.join(__dirname, 'dist')));

app.use('/.*/', (request, response) => {
    response.sendFile(path.join(__dirname, 'dist/index.html'));
});

const sendError = (response, error, message) => {
    console.log('ERROR ' + error);
    response.status(500).json({message: message});
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

app.get('/invoice/get-all', (request, response) => {
    const token = request.headers.token;
    if (!token) {
        sendError(response, 'Authentication is none', 'Authentication required');
        return;
    }
    admin.auth().verifyIdToken(token).then(token => {
        console.info(token);
        invoice.find((error, docs) => {
            if (error) {
                sendError(response, error, 'Failed to get invoices');
            } else {
                console.log('Get all invoice docs successfully.');
                response.status(200).json(docs);
            }
        });
    }).catch(error => {
        sendError(response, error, 'Authorization required.');
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
            sendError(response, error, 'Failed to update invoice.');
        } else {
            console.log('Updated invoice successfully');
            response.status(200).json(doc);
        }
    });
});

app.delete('/invoice/delete', (request, response) => {
    invoice.findByIdAndDelete(request.query.id, (error, doc) => {
        if (error) {
            sendError(response, error, 'Failed to delete invoice.');
        } else {
            console.log('Invoice was deleted successfully');
            response.status(200).json(doc);
        }
    });
});

app.listen(environment.server.port, environment.server.host, () => {
    console.log('Server started at %s on port %s', environment.server.host, environment.server.port);
});