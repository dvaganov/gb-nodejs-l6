'use strict'

const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;

const GITHUB_CLIENT_ID = '51062826b1052cf17067';
const GITHUB_CLIENT_SECRET = 'db2c22a77d44893d02fe35e1dbd6016ca27ce7de';

passport.use(
    new GithubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:8888/auth/github/cb'
    },
    (accessToken, refreshToken, profile, cb) => {
        console.log(accessToken, refreshToken, profile);
        return cb(null, profile);
    })
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

module.exports = passport;
