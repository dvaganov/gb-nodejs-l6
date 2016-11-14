'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const User = require('./models/user.js');

let auth = express();
let urlEncodedParser = bodyParser.urlencoded({extended: false});

auth.route('/')
    .post(urlEncodedParser, (req, res, next) => {
        User.findByName(req.body.name, (user) => {
            if (!user) {
                res.locals.err = 'Username or password is not correct.';
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
                    res.locals.err = 'Username or password is not correct.';
                    next();
                }
                return;
            });
        });
    })
    .all((req, res) => {
        res.render('user-form-signin');
    });

auth.route('/signup')
    .post(urlEncodedParser, (req, res, next) => {
        if (!req.body || !req.body.name || !req.body.password) {
            res.locals.err = 'Data is not correct.';
            return next();
        }

        User.findByName(req.body.name, (user) => {
            if (user) {
                res.locals.err = 'Username is not valid. Try something else.';
                return next();
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
        })
    })
    .all((req, res) => {
        res.render('user-form-signup');
    });

module.exports = auth;
