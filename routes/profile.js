import { Router } from "express";
import userDataFunctions from "../data/user.js";
import helper from "../helpers.js";
import bcrypt from "bcrypt";

const router = Router();

router.get("/users", async (req, res) => {
  let prefix = req.query.prefix.trim();
  prefix = prefix.toLowerCase();
  if (!prefix) {
    return res
      .status(400)
      .json({ error: "Prefix is required for searching users." });
  }

  try {
    const users = await userDataFunctions.searchUsersByPrefix(prefix);

    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(404).json({ error: "No matching users found." });
    }

    const limitedUsers = users.slice(0, 5);

    const userNames = limitedUsers.map((user) => {
      return user.userName;
    });
    res.json(userNames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/friendrequests", async (req, res) => {
  const userName = req.session.user.userName;
  if (!userName) {
    return res
      .status(401)
      .json({ error: "User must be logged in to access friend requests." });
  }

  try {
    const user = await userDataFunctions.getUserByUsername(userName);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const friendRequests = user.friends.incomingRequests;
    if (friendRequests.length === 0) {
      return res.status(404).json({ error: "No friend requests found." });
    }
    res.json(friendRequests);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.post("/resolverequest", async (req, res) => {
  const { decision, userName } = req.body;
  const currentUser = req.session.user.userName;

  if (!currentUser) {
    return res.status(401).json({ error: "User must be logged in." });
  }

  try {
    let result;
    if (decision === "accept") {
      result = await userDataFunctions.acceptFriendRequest(
        currentUser,
        userName,
      );
    } else if (decision === "deny") {
      result = await userDataFunctions.denyFriendRequest(currentUser, userName);
    } else {
      return res.status(400).json({ error: "Invalid decision." });
    }

    return res.status(200).json({ message: "Request resolved.", result });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.post("/createrequest", async (req, res) => {
  const targetUserName = req.body.targetUserName;
  const currentUserName = req.session.user.userName;

  if (!currentUserName) {
    return res.status(401).json({ error: "User must be logged in." });
  }

  try {
    const result = await userDataFunctions.createFriendRequest(
      currentUserName,
      targetUserName,
    );
    return res.status(200).json({ message: "Friend request sent.", result });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/:userName", async (req, res) => {
  const { userName } = req.params;

  try {
    const validatedUserName = helper.inputValidator(userName, "userName");
    const user = await userDataFunctions.getUserByUsername(validatedUserName);

    if (!user) {
      return res.status(404).render("error", { error: "User not found." });
    }

    let isMe = false;
    let friendRequests = [];

    if (req.session && req.session.user) {
      isMe = req.session.user.userName === validatedUserName;
      if (isMe) {
        friendRequests = user.friends.incomingRequests;
      }
    }

    return res
      .status(200)
      .render("profile", { profile: user, isMe, friendRequests });
  } catch (error) {
    if (error && error.message && error.message.includes("not valid")) {
      return res.status(400).render("error", { error: "Invalid username." });
    }

    return res.status(500).render("error", {
      error: "An error occurred while fetching the profile.",
    });
  }
});

router.patch("/:userName", async (req, res) => {
  const updatedData = req.body;
  const { userName } = req.session.user;
  try {
    const user = await userDataFunctions.getUserByUsername(userName);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let updatedUserData = {};
    let userOrPasswordChanged = false;
    if (updatedData.firstName)
      updatedUserData.firstName = helper.inputValidator(
        updatedData.firstName,
        "firstName",
      );
    if (updatedData.lastName)
      updatedUserData.lastName = helper.inputValidator(
        updatedData.lastName,
        "lastName",
      );
    if (updatedData.userName)
      updatedUserData.userName = helper.inputValidator(
        updatedData.userName,
        "userName",
      );
    if (updatedData.userName && updatedData.userName !== user.userName) {
      userOrPasswordChanged = true;
    }
    if (updatedData.emailAddress)
      updatedUserData.emailAddress = helper.emailValidator(
        updatedData.emailAddress,
      );
    if (updatedData.password)
      updatedUserData.password = helper.passwordValidator(updatedData.password);
    if (user.password !== updatedUserData.password) {
      updatedUserData.password = await bcrypt.hash(
        updatedUserData.password,
        10,
      );
      userOrPasswordChanged = true;
    }
    if (updatedData.description)
      updatedUserData.description = updatedData.description.trim();
    if (updatedData.age !== undefined) {
      const age = parseInt(updatedData.age, 10);
      if (age > 0) updatedUserData.age = age;
      else throw new Error("Age is invalid");
    }

    if (updatedData.userName !== user.userName) {
      const existingUser = await userDataFunctions.checkUserByUsername(
        updatedUserData.userName,
      );
      if (existingUser !== null) {
        throw new Error("Username already exists");
      }
    }

    if (updatedData.emailAddress !== user.emailAddress) {
      const existingUser = await userDataFunctions.checkUserByEmail(
        updatedUserData.emailAddress,
      );
      if (existingUser !== null) {
        throw new Error("Email already in use");
      }
    }

    const updateResult = await userDataFunctions.updateUser(
      userName,
      updatedUserData,
    );
    if (!updateResult) {
      throw new Error("Update failed");
    }

    if (userOrPasswordChanged) {
      req.session.destroy();
      return res
        .status(200)
        .json({ message: "Profile updated, please log in again." });
    }

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    const statusCode =
      error.message === "User not found" || error.message === "Update failed"
        ? 404
        : 400;
    return res.status(statusCode).json({ error: error.message });
  }
});

router.patch("/:userName/updateProfilePicture", async (req, res) => {
  const userName = req.session.user.userName;
  const { profilePicture: newProfilePictureUrl } = req.body;

  try {
    helper.inputValidator(userName, "userName");

    const user = await userDataFunctions.getUserByUsername(userName);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    if (!newProfilePictureUrl || typeof newProfilePictureUrl !== "string") {
      console.log("Invalid profile picture URL");
      return res.status(400).json({ error: "Invalid profile picture URL" });
    }

    const updateResult = await userDataFunctions.updateUserProfilePicture(
      userName,
      newProfilePictureUrl,
    );
    if (!updateResult) {
      throw new Error("Failed to update profile picture");
    }

    return res
      .status(200)
      .json({ message: "Profile picture updated successfully" });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    const statusCode = error.message === "User not found" ? 404 : 400;
    return res.status(statusCode).json({ error: error.message });
  }
});

export default router;
