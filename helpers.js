import { ObjectId } from "mongodb";

let helper = {
  inputValidator(input, inputName) {
    if (!input) {
      throw `${input} is not a valid ${inputName}`;
    }
    if (typeof input != "string") {
      throw `${input} is not a valid string`;
    }
    input = input.trim();
    if (input === "") {
      throw `${inputName} cannot be an empty string`;
    }

    return input;
  },

  emailValidator(email) {
    if (!email) {
      throw `Invalid email`;
    }
    email = email.toLowerCase().trim();

    if (email === "") {
      throw `Email address contain be an empty string`;
    }

    if (typeof email != "string") {
      throw `Email address must be a valid string`;
    }
    let domRegex = /[^-[A-Za-z0-9]/g;
    let domRegexTwo = /((?<!\d+|\w+)-)|(-(?!\d+|\w+))/g;
    let preRegex = /[^A-Za-z0-9_.-]/g;
    let preRegexTwo = /[._-](?!\w+|\d+)/g;

    if (!email.includes("@") || !email.includes(".")) {
      throw "Invalid email.";
    }
    if (email.match(/@/g).length != 1) {
      throw "Invalid email.";
    }

    const [prefix, domain] = email.split("@");
    if (!prefix | !domain) {
      throw "Invalid email.";
    }
    const [domainName, com] = domain.split(".");
    if (prefix.length < 1 || domainName.length < 1) {
      throw "Invalid email.";
    }

    let invalidChars = prefix.match(preRegex);
    if (invalidChars != null) {
      throw "Invalid email.";
    }

    invalidChars = prefix.match(preRegexTwo);
    if (invalidChars != null) {
      throw "Invalid email.";
    }
    invalidChars = domainName.match(domRegex);
    if (invalidChars != null) {
      throw "Invalid email.";
    }
    invalidChars = domainName.match(domRegexTwo);
    if (invalidChars != null) {
      throw "Invalid email.";
    }
    if (com.length < 2) {
      throw "Invalid email.";
    }
    return email;
  },

  dateValidator(date) {
    let temp = new Date(date);
    if (isNaN(temp)) {
      throw "Invalid date";
    }
    return true;
  },

  idValidator(id) {
    if (!id) {
      throw "No id was provided";
    }
    if (typeof id != "string") {
      throw "Id must be a string!";
    }
    id = id.trim();
    if (id.length === 0) {
      throw "Id can't be an empty string.";
    }
    if (!ObjectId.isValid(id)) {
      throw "Id is invalid.";
    }
    return id;
  },
  passwordValidator(password) {
    if (!password) {
      throw `You have input an invalid password`;
    }
    password = password.trim();
    if (password === "") {
      throw `Password cannot contain be an empty string`;
    }

    if (typeof password != "string") {
      throw `Password must be a valid string`;
    }

    if (password.length < 8) {
      throw "password must be atleast 8 characters.";
    }
    if (password.match(/\ /g)) {
      throw "password cannot contain spaces.";
    }
    let uppercaseRegex = /[A-Z]+/g;
    let numberRegex = /[0-9]+/g;
    let symbolRegex = /[~`!@#\$%^&*()_+\-=[\]{}|\\;:'",<.>\/?]+/g;
    if (!password.match(uppercaseRegex)) {
      throw "Password must have atleast 1 UPPERCASE character";
    }
    if (!password.match(numberRegex)) {
      throw "Password must have atleast 1 NUMBER";
    }
    if (!password.match(symbolRegex)) {
      throw "Password must have atleast 1 SPECIAL character";
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
    age,
    friendsList,
    incomingRequests,
    outgoingRequests,
  ) {
    try {
      firstName = this.inputValidator(firstName, "firstName");
      lastName = this.inputValidator(lastName, "lastName");
      userName = this.inputValidator(userName, "userName");
      emailAddress = this.emailValidator(emailAddress);
      password = this.passwordValidator(password);
    } catch (e) {
      throw `${e}`;
    }

    description = description.trim();

    if (age && age < 0) throw "Age cannot be a negative number";

    return {
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      emailAddress: emailAddress,
      password: password,
      aboutMe: { description: description, age: age },
      friends: {
        friendsList: friendsList,
        incomingRequests: incomingRequests,
        outgoingRequests: outgoingRequests,
      },
    };
  },

  loginUserValidator(userName, password) {
    userName = userName.trim();

    try {
      userName = this.inputValidator(userName, "userName");
      password = this.passwordValidator(password);
    } catch (e) {
      throw e;
    }

    return {
      userName: userName,
      password: password,
    };
  },

  exerciseValidator(
    exerciseName,
    targetMuscle,
    exerciseDescription,
    instructions,
    equipment,
    difficulty,
    image,
  ) {
    try {
      exerciseName = this.inputValidator(exerciseName, "exerciseName");
      exerciseDescription = this.inputValidator(
        exerciseDescription,
        "exerciseDescription",
      );
      instructions = this.inputValidator(instructions, "instructions");
      difficulty = this.inputValidator(difficulty, "difficulty");
      image = this.inputValidator(image, "image");
    } catch (e) {
      throw `${e}`;
    }

    return {
      name: exerciseName,
      targetMuscles: targetMuscle,
      description: exerciseDescription,
      instructions: instructions,
      equipment: equipment,
      difficulty: difficulty,
      image: image,
    };
  },
  workoutValidator(name, workoutTypes, notes, exercises) {
    const definedWorkoutTypes = [];

    try {
      name = helper.inputValidator(name, "name");
    } catch (e) {
      throw `${e}`;
    }

    if (typeof notes !== "string") {
      throw "Notes must be a valid string";
    }
    notes = notes.trim();

    if (
      !Array.isArray(workoutTypes) ||
      workoutTypes.some(
        (workout) =>
          workout.trim() === "" && definedWorkoutTypes.includes(workout.trim()),
      )
    ) {
      throw "workoutType must be a valid array.";
    }

    if (!Array.isArray(exercises)) throw "Exercises must be an array.";

    exercises = exercises.map((exercise) => {
      if (typeof exercise.sets !== "number" || exercise.sets <= 0)
        throw "Sets is invalid";

      if (typeof exercise.reps !== "number" || exercise.reps <= 0)
        throw "Reps is invalid";

      const id = this.idValidator(exercise.id);

      return {
        id: id,
        sets: exercise.sets,
        reps: exercise.reps,
      };
    });

    return {
      name: name,
      workoutTypes: workoutTypes,
      notes: notes,
      exercises: exercises,
    };
  },
};

export default helper;
