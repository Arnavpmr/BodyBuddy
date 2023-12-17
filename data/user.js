import helper from "../helpers.js";
import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

let userDataFunctions = {
  async createUser(
    firstName,
    lastName,
    userName,
    emailAddress,
    password,
    description,
    age,
    role,
  ) {
    let validatedInput = undefined;
    let friendsList = [];
    let incomingRequests = [];
    let outgoingRequests = [];

    try {
      validatedInput = helper.createUserValidator(
        firstName,
        lastName,
        userName.toLowerCase(),
        emailAddress.toLowerCase(),
        password,
        description,
        age,
        friendsList,
        incomingRequests,
        outgoingRequests,
        role,
      );
    } catch (e) {
      throw e;
    }

    const userCollections = await users();
    const userEmail = await userCollections
      .find({ emailAddress: validatedInput.emailAddress })
      .toArray();
    if (userEmail.length > 0) {
      throw "Email address already exists.";
    }

    const user = await userCollections
      .find({ userName: validatedInput.userName })
      .toArray();
    if (user.length > 0) {
      throw "That username is already taken.";
    }

    let saltRounds = 12;
    const hash = await bcrypt.hash(validatedInput.password, saltRounds);
    const newUser = { ...validatedInput, password: hash };

    const entry = await userCollections.insertOne(newUser);
    if (!entry.acknowledged || !entry.insertedId) {
      throw "Unable to create user.";
    }

    return { insertedUser: true };
  },
  async getUserById(userId) {
    try {
      userId = helper.idValidator(userId);
    } catch (e) {
      throw `${userId} not valid.`;
    }
    const userCollections = await users();
    let user = await userCollections.findOne({ _id: new ObjectId(userId) });

    user._id = user._id.toString();
    return user;
  },
  async getUserByUsername(userName) {
    try {
      userName = helper.inputValidator(userName);
    } catch (e) {
      throw `${userName} not valid.`;
    }
    const userCollections = await users();
    let user = await userCollections.findOne({ userName: userName });
    user._id = user._id.toString();
    return user;
  },
  async getAllUsers() {
    const userCollections = await users();
    let allUsers = await userCollections.find({}).toArray();

    if (!allUsers) {
      throw "No users in database.";
    }
    return allUsers;
  },
  async removeUser(userId) {
    try {
      helper.idValidator(userId);
    } catch (e) {
      throw `${userId} not valid.`;
    }
    const userCollections = await users();
    let userRemoved = await userCollections.findOneAndDelete({
      _id: new ObjectId(userId),
    });
    if (!userRemoved) {
      throw "User does not exist.";
    }
    let myObj = { userName: userRemoved.userName, deleted: true };
    return myObj;
  },
  async updateUser(
    userId,
    firstName,
    lastName,
    userName,
    emailAddress,
    password,
    description,
    age,
    role,
  ) {
    let user = null;
    const userCollections = await users();
    try {
      helper.idValidator(userId);
    } catch (e) {
      throw `${userId} not valid.`;
    }
    user = await userCollections.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw `User does not exist.`;
    }

    try {
      firstName = helper.inputValidator(firstName, "firstName");
      lastName = helper.inputValidator(lastName, "lastName");
      userName = helper.inputValidator(userName, "userName");
    } catch (e) {
      throw `${e}`;
    }

    // Optional
    description = description.trim();
    if (age && age < 0) {
      throw `Age cannot be a negative number.`;
    }

    try {
      emailAddress = helper.emailValidator(emailAddress);
    } catch (e) {
      throw e;
    }

    let updatedUser = await userCollections.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      {
        $set: {
          firstName: firstName,
          lastName: lastName,
          userName: userName,
          emailAddress: emailAddress,
          password: password,
          aboutMe: { description: description, age: age },
          friends: {
            friendsList: updatedUser.friendsList,
            incomingRequests: updatedUser.incomingRequests,
            outgoingRequests: updatedUser.outgoingRequests,
          },
          role: role,
        },
      },
      { returnDocument: "after" },
    );
    return updatedUser;
  },

  async loginUser(userName, password) {
    let validatedInput = undefined;

    try {
      validatedInput = helper.loginUserValidator(userName, password);
    } catch (e) {
      throw e;
    }

    let userCollections = await users();
    let user = await userCollections.findOne({
      userName: validatedInput.userName,
    });

    if (!user) throw "Either the Username or Password is invalid";

    let comparePass = await bcrypt.compare(
      validatedInput.password,
      user.password,
    );

    let userObj = {};

    if (comparePass) {
      userObj = {
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        userName: user.userName,
        aboutMe: {
          description: user.aboutMe.description,
          age: user.aboutMe.age,
        },
        role: user.role,
      };
    } else {
      throw "Either the Username or password is invalid";
    }

    return userObj;
  },
  async addFriend(userId, friendId) {
    try {
      userId = helper.idValidator(userId);
    } catch (e) {
      throw e;
    }
    try {
      friendId = helper.idValidator(friendId);
    } catch (e) {
      throw e;
    }

    let userCollections = await users();
    let user = await userCollections.findOne({ _id: new ObjectId(userId) });
    if (!user) throw "User not found";
    let friend = await userCollections.findOne({
      _id: new ObjectId(friendId),
    });
    if (!friend) throw "Friend not found";

    const userAdding = await userCollections.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      {
        $push: { "friends.friendsList": new ObjectId(friend._id) },
      },
      { returnDocument: "after" },
    );
    const userAdded = await userCollections.findOneAndUpdate(
      { _id: new ObjectId(friendId) },
      {
        $push: { "friends.friendsList": new ObjectId(user._id) },
      },
      { returnDocument: "after" },
    );
    let myObj = { friendshipTransaction: "Success" };
    return myObj;
  },
  async friendRequest(userId, friendId) {
    try {
      userId = helper.idValidator(userId);
    } catch (e) {
      throw e;
    }
    try {
      friendId = helper.idValidator(friendId);
    } catch (e) {
      throw e;
    }

    let userCollections = await users();
    let user = await userCollections.findOne({ _id: new ObjectId(userId) });
    if (!user) throw "User not found";
    let friend = await userCollections.findOne({
      _id: new ObjectId(friendId),
    });
    if (!friend) throw "Friend not found";

    const outgoingRequest = await userCollections.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      {
        $push: { "friends.outgoingRequests": new ObjectId(friend._Id) },
      },
      { returnDocument: "after" },
    );
    const incomingRequest = await userCollections.findOneAndUpdate(
      { _id: new ObjectId(friendId) },
      {
        $push: { "friends.outgoingRequests": new ObjectId(user._id) },
      },
      { returnDocument: "after" },
    );
    let myObj = { friendshipTransaction: "Success" };
    return myObj;
  },
};

export default userDataFunctions;
