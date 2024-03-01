const express = require("express");
const userRouter = express.Router();
const { hashPassword, comparePassword } = require("../middleware//auth");
const { signupUser, getAllUsers, loginUser } = require("./controller");

// Route for user signup
userRouter.post("/signup", hashPassword, signupUser);

// Route for user login
userRouter.post("/users/login", hashPassword, loginUser, comparePassword);

// Route definition
userRouter.get("/users/getAllUsers", getAllUsers);

// Route to get all logged-in users
// userRouter.get("/getAllLoggedIn", getAllLoggedIn);

module.exports = userRouter;
