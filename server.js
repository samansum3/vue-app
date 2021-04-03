const express = require('express');
const serverStatic = require('serve-static');
const path = require('path');

const connectToMongodb = require('./database/mongodb');
const environment = require('./config/environment');

const app = express();

//connect to db
connectToMongodb();

app.use('/', serverStatic(path.join(__dirname, 'dist')));

app.use('/.*/', (request, response) => {
    response.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(environment.server.port, environment.server.host, () => {
    console.log('Server started at %s on port %s', environment.server.host, environment.server.port);
});