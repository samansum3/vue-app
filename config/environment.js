const env = process.env.NODE_ENV || 'dev';

const environment = {
    dev: {
        server: {
            host: process.env.HOST || '0.0.0.0',
            port: process.env.PORT || 8080,
        }
    },
    production: {
        server: {
            host: process.env.HOST || '0.0.0.0',
            port: process.env.PORT || 8080,
        }
    }
};

module.exports = environment[env];