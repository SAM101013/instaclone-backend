const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const User = require("./Users/model");
const cors = require("cors");
const { hashPassword, comparePassword } = require("./middleware/auth");

dotenv.config();

const app = express();
const port = process.env.PORT || 5004;

// Middleware

app.use(cors());
app.use(bodyParser.json());

// Custom authentication middleware
const authenticateUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Find the user in the database by username
    const user = await User.findOne({ where: { username } });

    // If user not found, return 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the hashed password in the database
    const match = await comparePassword(password, user.password);

    // If passwords match, proceed to the next middleware
    if (match) {
      req.user = user; // Attach user object to the request for future use
      next();
    } else {
      // If passwords don't match, return 401 unauthorized
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    // Handle server errors
    console.error("Error during authentication:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// User signup route
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password before saving it to the database
    const hashedPassword = await hashPassword(password);

    // Create user with hashed password
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    // Handle server errors
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// User login route with authentication middleware
app.post("/users/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await comparePassword(password, user.password);
    if (match) {
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get all users
app.get("/users/getAllUsers", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ message: "All users", users });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res
      .status(500)
      .json({ message: "Error retrieving users", error: error.message });
  }
});

// Sync the model with the database before starting the server
(async () => {
  try {
    await User.sync();
    console.log("User model synchronized successfully");
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error("Error synchronizing User model:", error);
  }
})();
