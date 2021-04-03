const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect(process.env.VUE_APP_MONGO_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    mongoose.connection.on('error', (error) => {
        console.log('ERROR ' + error); 
    });

    mongoose.connection.once('open', () => {
        console.log('INFO: Connected to mongodb'); 
    });
}