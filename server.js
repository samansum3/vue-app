const express = require('express');
const serverStatic = require('serve-static');
const path = require('path');
const { appendFileSync } = require('fs');

const app = express();

app.use('/', serverStatic(path.join(__dirname, 'dist')));

app.use('/.*/', (request, response) => {
    response.sendFile(path.join(__dirname, 'dist/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('Server started at:' + port);
})