import helper from "../helpers.js";
import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import workoutDataFunctions from "./workouts.js";

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
    let defaultProfilePicture = "../public/res/avatars/defaultAvatar.jpeg";
    // console.log(role)
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
    const newUser = {
      ...validatedInput,
      password: hash,
      profilePicture: defaultProfilePicture,
      workouts: [],
    };

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
    if (!user) {
      throw "User does not exist.";
    }
    user._id = user._id.toString();
    return user;
  },
  async checkUserByUsername(userName) {
    try {
      userName = helper.inputValidator(userName);
    } catch (e) {
      throw `${userName} not valid.`;
    }
    const userCollections = await users();
    let user = await userCollections.findOne({ userName: userName });
    return user;
  },
  async checkUserByEmail(emailAddress) {
    try {
      emailAddress = helper.emailValidator(emailAddress);
    } catch (e) {
      throw `${emailAddress} not valid.`;
    }
    const userCollections = await users();
    let user = await userCollections.findOne({
      emailAddress: emailAddress,
    });
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
  async updateUser(currentUserName, updatedFields) {
    const userCollections = await users();

    const existingUser = await userCollections.findOne({
      userName: currentUserName,
    });
    if (!existingUser) {
      throw "User not found with the provided userName.";
    }

    let fieldsToUpdate = {};
    if (updatedFields.firstName !== undefined)
      fieldsToUpdate.firstName = helper.inputValidator(
        updatedFields.firstName,
        "firstName",
      );
    if (updatedFields.lastName !== undefined)
      fieldsToUpdate.lastName = helper.inputValidator(
        updatedFields.lastName,
        "lastName",
      );
    if (updatedFields.userName !== undefined)
      fieldsToUpdate.userName = helper.inputValidator(
        updatedFields.userName,
        "userName",
      );
    if (updatedFields.emailAddress !== undefined)
      fieldsToUpdate.emailAddress = helper.emailValidator(
        updatedFields.emailAddress,
      );
    if (updatedFields.password !== undefined) {
      fieldsToUpdate.password = updatedFields.password;
    }
    if (updatedFields.description !== undefined) {
      if (!fieldsToUpdate.aboutMe) fieldsToUpdate.aboutMe = {};
      fieldsToUpdate.aboutMe.description = updatedFields.description.trim();
    }
    if (updatedFields.age !== undefined) {
      if (typeof updatedFields.age === "number" && updatedFields.age > 0) {
        if (!fieldsToUpdate.aboutMe) fieldsToUpdate.aboutMe = {};
        fieldsToUpdate.aboutMe.age = updatedFields.age;
      } else {
        throw "Age is invalid";
      }
    }
    const updatedUser = await userCollections.findOneAndUpdate(
      { userName: currentUserName },
      { $set: fieldsToUpdate },
      { returnDocument: "after" },
    );
    if (!updatedUser) {
      throw "Unable to update user.";
    }

    return updatedUser;
  },

  async addWorkoutToUser(username, workoutId) {
    const userData = await this.getUserByUsername(username);
    const isWorkout = await workoutDataFunctions.getWorkoutById(workoutId);

    const usersCollection = await users();
    const usersFound = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userData._id.toString()) },
      {
        $push: {
          workouts: isWorkout._id.toString(),
        },
      },
      { returnDocument: "after" },
    );

    return usersFound;
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
  async searchUsersByPrefix(prefix) {
    const userCollections = await users();
    const query = { userName: new RegExp("^" + prefix) };
    const foundUsers = await userCollections.find(query).toArray();

    if (foundUsers.length === 0) {
      throw "No users found with the given prefix.";
    }
    return foundUsers;
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
  async acceptFriendRequest(currentUserName, requesterUserName) {
    const userCollections = await users();
    let user = await userCollections.findOne({ userName: currentUserName });
    if (!user.friends.incomingRequests.includes(requesterUserName)) {
      throw "No friend request from this user.";
    }
    await userCollections.updateOne(
      { userName: currentUserName },
      {
        $pull: { "friends.incomingRequests": requesterUserName },
        $push: { "friends.friendsList": requesterUserName },
      },
    );

    await userCollections.updateOne(
      { userName: requesterUserName },
      {
        $push: { "friends.friendsList": currentUserName },
        $pull: { "friends.outgoingRequests": currentUserName },
      },
    );

    return { status: "Friend request accepted" };
  },

  async denyFriendRequest(currentUserName, requesterUserName) {
    const userCollections = await users();
    let user = await userCollections.findOne({ userName: currentUserName });
    if (!user.friends.incomingRequests.includes(requesterUserName)) {
      throw "No friend request from this user.";
    }
    await userCollections.updateOne(
      { userName: currentUserName },
      { $pull: { "friends.incomingRequests": requesterUserName } },
    );

    return { status: "Friend request denied" };
  },

  async createFriendRequest(currentUserName, targetUserName) {
    const userCollections = await users();
    let user = await userCollections.findOne({ userName: currentUserName });
    if (!user) {
      throw Error("Current user not found.");
    }
    let targetUser = await userCollections.findOne({
      userName: targetUserName,
    });
    if (!targetUser) {
      throw "Target user not found.";
    }

    if (user.friends.friendsList.includes(targetUserName)) {
      throw "You are already friends with this user.";
    }

    if (user.friends.outgoingRequests.includes(targetUserName)) {
      throw Error("You have already sent a friend request to this user.");
    }

    if (user.friends.incomingRequests.includes(targetUserName)) {
      throw "This user has already sent you a friend request.";
    }

    await userCollections.updateOne(
      { userName: targetUserName },
      { $push: { "friends.incomingRequests": currentUserName } },
    );

    await userCollections.updateOne(
      { userName: currentUserName },
      { $push: { "friends.outgoingRequests": targetUserName } },
    );

    return { status: "Friend request sent" };
  },
  async updateUserProfilePicture(userName, newPictureUrl) {
    try {
      helper.inputValidator(userName, "userName");
    } catch (e) {
      throw new Error(e);
    }

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
      { userName: userName },
      { $set: { profilePicture: newPictureUrl } },
    );

    return { profileUpdated: true };
  },
};

export default userDataFunctions;
