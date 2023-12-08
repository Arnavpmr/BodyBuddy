import { ObjectId } from 'mongodb';

let helper = {
    inputValidator(input, inputName) {
        if (!input) {
            throw `Error: ${input} is not a valid ${inputName}`;
        }
        if (typeof input != 'string') {
            throw `Error: ${input} is not a valid string`;
        }
        input = input.trim();
        if (input === '') {
            throw `Error: ${inputName} cannot be an empty string`;
        }

        return input;
    },

    emailValidator(email) {
        if (!email) {
            throw `You have input an invalid email address`;
        }
        email = email.toLowerCase().trim();

        if (email === '') {
            throw `Email address contain be an empty string`;
        }

        if (typeof email != 'string') {
            throw `Email address must be a valid string`;
        }
        let domRegex = /[^-[A-Za-z0-9]/g;
        let domRegexTwo = /((?<!\d+|\w+)-)|(-(?!\d+|\w+))/g;
        let preRegex = /[^A-Za-z0-9_.-]/g;
        let preRegexTwo = /[._-](?!\w+|\d+)/g;

        if (!email.includes('@') || !email.includes('.')) {
            throw 'Error: Invalid email.';
        }
        if (email.match(/@/g).length != 1) {
            throw 'Error: Invalid email.';
        }

        const [prefix, domain] = email.split('@');
        if (!prefix | !domain) {
            throw 'Error: Invalid email.';
        }
        const [domainName, com] = domain.split('.');
        if (prefix.length < 1 || domainName.length < 1) {
            throw 'Error: Invalid email.';
        }

        let invalidChars = prefix.match(preRegex);
        if (invalidChars != null) {
            throw 'Error: Invalid email.';
        }

        invalidChars = prefix.match(preRegexTwo);
        if (invalidChars != null) {
            throw 'Error: Invalid email.';
        }
        invalidChars = domainName.match(domRegex);
        if (invalidChars != null) {
            throw 'Error: Invalid email.';
        }
        invalidChars = domainName.match(domRegexTwo);
        if (invalidChars != null) {
            throw 'Error: Invalid email.';
        }
        if (com.length < 2) {
            throw 'Error: Invalid email.';
        }
        return email;
    },

    dateValidator(date) {
        let temp = new Date(date);
        if (isNaN(temp)) {
            throw 'Error: Invalid date';
        }
        return true;
    },

    idValidator(id) {
        if (!id) {
            throw 'Error: No id was provided';
        }
        if (typeof id != 'string') {
            throw 'Error: id must be a string!';
        }
        id = id.trim();
        if (id.length === 0) {
            throw "Error: id can't be an empty string.";
        }
        if (!ObjectId.isValid(id)) {
            throw 'Error: id is invalid.';
        }
        return id;
    },
    passwordValidator(password) {
        if (!password) {
            throw `You have input an invalid password`;
        }
        password = password.trim();
        if (password === '') {
            throw `Password cannot contain be an empty string`;
        }

        if (typeof password != 'string') {
            throw `Password must be a valid string`;
        }

        if (password.length < 8) {
            throw 'password must be atleast 8 characters.';
        }
        if (password.match(/\ /g)) {
            throw 'password cannot contain spaces.';
        }
        let uppercaseRegex = /[A-Z]+/g;
        let numberRegex = /[0-9]+/g;
        let symbolRegex = /[~`!@#\$%^&*()_+\-=[\]{}|\\;:'",<.>\/?]+/g;
        if (!password.match(uppercaseRegex)) {
            throw 'Password must have atleast 1 UPPERCASE character';
        }
        if (!password.match(numberRegex)) {
            throw 'Password must have atleast 1 NUMBER';
        }
        if (!password.match(symbolRegex)) {
            throw 'Password must have atleast 1 SPECIAL character';
        }
        return password;
    },

    createUserValidator(
        firstName,
        lastName,
        userName,
        emailAddress,
        password,
        description,
        age
    ) {
        try {
            firstName = this.inputValidator(firstName, 'firstName');
            lastName = this.inputValidator(lastName, 'lastName');
            userName = this.inputValidator(userName, 'userName');
            emailAddress = this.emailValidator(emailAddress);
            password = this.passwordValidator(password);
        } catch (e) {
            throw `${e}`;
        }

        description = description.trim();

        if (age && age < 0) throw 'Age cannot be a negative number';

        return {
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            emailAddress: emailAddress,
            password: password,
            aboutMe: { description: description, age: age },
        };
    },

    loginUserValidator(userName, password) {
        userName = userName.trim();

        try {
            userName = this.inputValidator(userName, 'userName');
            password = this.passwordValidator(password);
        } catch (e) {
            throw e;
        }

        return {
            userName: userName,
            password: password,
        };
    },
};

export default helper;
