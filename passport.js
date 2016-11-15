'use strict'

const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;

const User = require('./models/user.js');
const config = require('./config.js');

passport.use(
    new GithubStrategy(
        config.github,
        (accessToken, refreshToken, profile, cb) => {
            let email = profile.emails[0].value;

            User.findByEmail(email, (user) => {
                if (user) {
                    user.githubID = profile.id;
                } else {
                    user = new User({
                        email: email,
                        name: profile.username,
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
