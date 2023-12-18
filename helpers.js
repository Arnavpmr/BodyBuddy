import { ObjectId } from "mongodb";
import storageFirebase from "./firebase.js";
import { getDownloadURL } from "firebase-admin/storage";
import xss from "xss";

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
      throw "Password must have at least 1 UPPERCASE character";
    }
    if (!password.match(numberRegex)) {
      throw "Password must have at least 1 NUMBER";
    }
    if (!password.match(symbolRegex)) {
      throw "Password must have at least 1 SPECIAL character";
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
    role,
  ) {
    firstName = this.inputValidator(firstName, "firstName");
    lastName = this.inputValidator(lastName, "lastName");
    userName = this.inputValidator(userName, "userName");
    emailAddress = this.emailValidator(emailAddress);
    password = this.passwordValidator(password);

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
      role: role,
    };
  },

  loginUserValidator(userName, password) {
    userName = this.inputValidator(userName, "userName");
    password = this.passwordValidator(password);

    return {
      userName: userName,
      password: password,
    };
  },

  registerUserValidator(
    firstName,
    lastName,
    userName,
    emailAddress,
    password,
    confirmPassword,
  ) {
    firstName = this.inputValidator(firstName, "firstName");
    lastName = this.inputValidator(lastName, "lastName");
    userName = this.inputValidator(userName, "userName");
    emailAddress = this.emailValidator(emailAddress);
    password = this.passwordValidator(password);

    if (password !== confirmPassword) throw "Passwords do not match";

    return {
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      emailAddress: emailAddress,
      password: password,
    };
  },

  exerciseValidator(
    exerciseName,
    targetMuscles,
    exerciseDescription,
    instructions,
    equipment,
    difficulty,
    image,
  ) {
    exerciseName = this.inputValidator(exerciseName, "exerciseName");
    exerciseDescription = this.inputValidator(
      exerciseDescription,
      "exerciseDescription",
    );
    instructions = this.inputValidator(instructions, "instructions");
    difficulty = this.inputValidator(difficulty, "difficulty");
    image = this.inputValidator(image, "image");

    if (!Array.isArray(targetMuscles)) {
      throw "TargetMuscle must be an array.";
    }
    if (!Array.isArray(equipment)) {
      throw "Equiment must be an array.";
    }

    return {
      name: exerciseName,
      targetMuscles: targetMuscles,
      description: exerciseDescription,
      instructions: instructions,
      equipment: equipment,
      difficulty: difficulty,
      image: image,
    };
  },

  exerciseComponentValidator(exercise) {
    const sets = Number(exercise.sets);
    const reps = Number(exercise.reps);
    const test_id = exercise.id;
    if (isNaN(sets) || sets <= 0 || !Number.isInteger(sets))
      throw "Sets is invalid";

    if (isNaN(reps) || reps <= 0 || !Number.isInteger(reps))
      throw "Reps is invalid";

    const id = this.idValidator(test_id);

    return {
      id: id,
      sets: sets,
      reps: reps,
    };
  },

  workoutValidator(name, workoutTypes, notes, exercises) {
    const definedWorkoutTypes = [];

    name = helper.inputValidator(name, "name");

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

    exercises = exercises.map((exercise) =>
      this.exerciseComponentValidator(exercise),
    );

    return {
      newName: name,
      newWorkoutTypes: workoutTypes,
      newNotes: notes,
      newExercises: exercises,
    };
  },

  challengeValidator(title, description, exercises, reward) {
    title = helper.inputValidator(title, "title");
    description = helper.inputValidator(description, "description");

    if (isNaN(reward) || reward <= 0 || !Number.isInteger(reward))
      throw "Reward is not a valid number";

    if (description.trim() === "") throw "Description cannot be empty";

    if (!Array.isArray(exercises)) throw "Exercises must be an array";
    if (exercises.length === 0) throw "Exercises cannot be empty";

    exercises = exercises.map((exercise) =>
      this.exerciseComponentValidator(exercise),
    );

    return {
      title: title,
      description: description,
      exercises: exercises,
      reward: reward,
    };
  },
  async uploadImageToFirebase(firebasePath, imageBuffer) {
    const bucket = storageFirebase.bucket();
    if (typeof firebasePath !== "string") throw "firebasePath must be a String";
    const path = firebasePath.trim();

    let link = "";
    const file = bucket.file(path, { uploadType: { resumeable: false } });
    await new Promise((res) => {
      file.save(imageBuffer, async (err) => {
        if (err) throw err;
        else {
          link = await getDownloadURL(file);
          res();
        }
      });
    });
    return { link: link, relPath: path };
  },
};

export const xssSafe = (input) => {
  console.log(
    `DEBUG: xssSafe called with input ${input} and type ${typeof input}`,
  );
  if (typeof input === "object") {
    if (Array.isArray(input)) {
      let parsed = input.map((e) => xssSafe(e));
      return parsed;
    } else {
      let parsed = xss(JSON.stringify(input));
      return JSON.parse(parsed);
    }
  } else {
    let parsed = xss(input);
    return parsed;
  }
};

export default helper;
