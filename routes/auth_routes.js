//import express, express router as shown in lecture code
import userDataHelpers from '../data/users.js';
import helper from '../helpers.js';
import { Router } from 'express';

const router = Router();

router.route('/').get(async (req, res) => {
    return res.json({
        error: 'YOU SHOULD NOT BE IN THIS ROUTE DUE TO MIDDLEWARE #1',
    });
});

router
    .route('/register')
    .get(async (req, res) => {
        return res.status(200).render('register', { title: 'Register' });
    })
    .post(async (req, res) => {
        let validatedInput = undefined;
        const {
            firstNameInput,
            lastNameInput,
            userNameInput,
            emailAddressInput,
            passwordInput,
            descriptionInput,
            ageInput,
        } = req.body;

        try {
            validatedInput = helper.createUserValidator(
                firstNameInput,
                lastNameInput,
                userNameInput,
                emailAddressInput,
                passwordInput,
                descriptionInput,
                ageInput
            );
        } catch (e) {
            return res
                .status(400)
                .render('register', { title: 'Register', error: e });
        }

        let resDB = null;

        try {
            resDB = await userDataHelpers.createUser(
                validatedInput.firstName,
                validatedInput.lastName,
                validatedInput.userName,
                validatedInput.emailAddress,
                validatedInput.password,
                validatedInput.description,
                validatedInput.age
            );
        } catch (e) {
            const status = 400;

            if (e === 'Internal Server Error') status = 500;

            return res
                .status(status)
                .render('register', { title: 'Register', error: e });
        }

        if (resDB.insertedUser) return res.redirect('/login');

        return res.render('register', { title: 'Register', error: e });
    });

router
    .route('/login')
    .get(async (req, res) => {
        return res.status(200).render('login', { title: 'Login' });
    })
    .post(async (req, res) => {
        let validatedInput = undefined;
        const { userNameInput, passwordInput } = req.body;

        try {
            validatedInput = helper.loginUserValidator(
                userNameInput,
                passwordInput
            );
        } catch (e) {
            return res
                .status(400)
                .render('login', { title: 'Login', error: e });
        }

        let resDB = null;

        try {
            resDB = await userDataHelpers.loginUser(
                validatedInput.userName,
                validatedInput.password
            );
        } catch (e) {
            const status = 400;

            if (e === 'Internal Server Error') status = 500;

            return res
                .status(status)
                .render('login', { title: 'Login', error: e });
        }

        req.session.user = {
            firstName: resDB.firstName,
            lastName: resDB.lastName,
            emailAddress: resDB.emailAddress,
            userName: resDB.userName,
            aboutMe: resDB.aboutMe,
        };

        return res.redirect('/home');
    });

router.route('/home').get(async (req, res) => {
    return res
        .status(200)
        .render('home', { title: 'Home', userData: req.session.user });
});

router.route('/logout').get(async (req, res) => {
    const anHourAgo = new Date();

    anHourAgo.setHours(anHourAgo.getHours() - 1);

    res.cookie('AuthState', '', { expires: anHourAgo });
    res.clearCookie('AuthState');

    req.session.destroy();

    return res.redirect('/login');
});

export default router;
