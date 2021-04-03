const express = require('express');
const serverStatic = require('serve-static');
const path = require('path');
const connectToMongodb = require('./database/mongodb');

const app = express();

//connect to db
connectToMongodb();

app.use('/', serverStatic(path.join(__dirname, 'dist')));

app.use('/.*/', (request, response) => {
    response.sendFile(path.join(__dirname, 'dist/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('Server started at:' + port);
});