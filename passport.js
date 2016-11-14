'use strict'

const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;

const User = require('./models/user.js');

const GITHUB_CLIENT_ID = '51062826b1052cf17067';
const GITHUB_CLIENT_SECRET = 'db2c22a77d44893d02fe35e1dbd6016ca27ce7de';

passport.use(
    new GithubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:8888/auth/github/cb',
        scope: ['user:email']
    },
    (accessToken, refreshToken, profile, cb) => {
        let email = profile.emails[0].value;

        User.findByEmail(email, (user) => {
            if (user) {
                user.githubID = profile.id;
            } else {
                user = new User({
                    email: email,
                    name: profile.name || profile.login,
                    githubID: profile.id
                });
            }

            user.save(() => {
                return cb(null, user);
            });
        });
    })
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    User.findByID(id, (user) => {
        cb(null, user);
    });
});

passport.mustBeAuth = (req, res, next) => {
    if (req.user.id !== 0)
        return next();

    res.redirect('/auth');
};

module.exports = passport;
