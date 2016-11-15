let hostname = 'localhost',
    port = 8888;

let config = {
    server: {
        port: port,
        hostname: hostname
    },

    db: {
        host: 'localhost',
        database: 'nodejs',
        user: 'root',
        password: ''
    },

    github: {
        clientID: '51062826b1052cf17067',
        clientSecret: 'db2c22a77d44893d02fe35e1dbd6016ca27ce7de',
        scope: ['user:email'],
        callback: `http://${hostname}:${port}/auth/github/cb`
    }
};


module.exports = config;
