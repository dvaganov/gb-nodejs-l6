'use strict'

const express = require('express');

const passport = require('./passport');
const User = require('./models/user.js');

let auth = express();

auth.restoreUser = (authKey, session, cb) => {
    User.findByAuthKey(authKey, (user) => {
        session.user = user;
        cb();
    });
};

auth.route('/')
    .post((req, res, next) => {
        User.findByEmail(req.body.email, (user) => {
            if (!user) {
                res.locals.err = 'Email or password is not correct.';
                return next();
            }

            user.checkPassword(req.body.password, (result) => {
                if (result) {
                    req.session.user = user;

                    if (req.body.save) {
                        // 100 years
                        let date = new Date();
                        date.setFullYear(date.getFullYear() + 100);
                        res.cookie('authKey', user.authKey, {expires: date});
                    }

                    res.redirect('/');
                } else {
                    res.locals.err = 'Email or password is not correct.';
                    return next();
                }
            });
        });
    })
    .all((req, res) => {
        res.render('auth/form-signin');
    });

auth.route('/signup')
    .post((req, res, next) => {
        if (!req.body || !req.body.email || !req.body.password) {
            res.locals.err = 'Data is not correct.';
            return next();
        }

        User.findByEmail(req.body.email, (user) => {
            if (user) {
                res.locals.err = 'Email is not valid. Try something else.';
                return next();
            }

            user = new User({
                email: req.body.email,
                name: req.body.name
            });

            user.setPassword(req.body.password, (user) => {
                user.save(() => {
                    res.redirect('/auth');
                });
            });
        })
    })
    .all((req, res) => {
        res.render('auth/form-signup');
    });

auth.all('/signout', (req, res) => {
    req.session = null;
    res.clearCookie('authKey');
    res.redirect('/');
});

auth.route('/github')
    .get(passport.authenticate('github'));

auth.route('/github/cb')
    .get(
        passport.authenticate('github', {
            successRedirect: '/',
            failureRiderect: '/auth'
        })
    );

module.exports = auth;
