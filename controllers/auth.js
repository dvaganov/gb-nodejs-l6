'use strict'

const User = require('../models/user.js');

let UserController = {
    signup: (req, res) => {
        res.render('user-form-signup');
    },

    add: (req, res) => {
        if (!req.body || !req.body.name || !req.body.password) {
            res.locals.err = 'Data is not correct.';
            res.render('user-form-signup');
            return;
        }

        User.findByName(req.body.name, (user) => {
            if (user) {
                res.locals.err = 'Username is not emtry. Try something else.';
                res.render('user-form-signup');
                return;
            }

            user = new User({
                name: req.body.name,
                firstName: req.body.firstName
            });

            user.setPassword(req.body.password, (user) => {
                user.save();
                res.redirect('/users/signin');
                return;
            });
        });

    },

    signin: (req, res) => {
        res.render('user-form-signin');
        return;
    },

    verify: (req, res) => {
        if (!req.body || !req.body.name || !req.body.password) {
            res.locals.err = 'Data is not correct.';
            res.render('user-form-signin');
            return;
        }

        User.findByName(req.body.name, (user) => {
            if (!user) {
                res.locals.err = 'Username or password is not correct.';
                res.render('user-form-signin')
                return;
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
                    res.locals.err = 'Username or password is not correct.';
                    res.render('user-form-signin');
                }
                return;
            });
        });
    },

    signout: (req, res) => {
        req.session = null;
        res.clearCookie('authKey');
        res.redirect('/');
        return;
    },

    restore: (req, res, next) => {
        let authKey = null;

        if (req.cookies)
            authKey = req.cookies.authKey;

        if (authKey) {
            User.findByAuthKey(authKey, (user) => {
                if (user)
                    req.session.user = user;
            });
        }
        next();
    },

    mustBeAuth: (req, res, next) => {
        if (req.session.user)
            return next();

        res.redirect('/users/signin');
    }
};

module.exports = UserController;
