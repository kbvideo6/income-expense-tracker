const User = require("../models/User");
const { appErr, AppErr } = require("../utils/appErr");
const JWTToken = require("../utils/validators");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Transaction = require("../models/Transaction");
const Account = require("../models/account");

//
const userRegistrationCrtl = async (req, res, next) => {
  try {
    const { username, email, password, firstName, lastName, phone } = req.body;

    if (!username || !email || !password || !firstName || !lastName || !phone) {
      return next(new Error("Please enter all required fields"));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json("User already exists with this email");
    }

    const newUser = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      phone,
    });

    await newUser.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

//
// userLoginCtrl.js
const userLoginCrtl = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" }); // 401 for auth failures
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" }); // Same message for security
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id }, "anykey", {
      expiresIn: "100h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// userProfileCtrl.js
const userProfileCrtl = async (req, res) => {
  // User is already attached to req by middleware
  const dataToShow = await User.findById(req.user._id).populate({
    path: "Accounts",
    populate: {
      path: "transactions",
      model: "Transaction",
    },
  });
  res.json({
    message: dataToShow,
    user: {
      username: req.user.username,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
    },
  });
};

const userProfileDeleteCrtl = async (req, res, next) => {
  try {
    // Validate user authentication
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user._id;

    // Validate deletion confirmation
    if (req.body.delete !== "true") {
      return res.status(400).json({ error: "Deletion not confirmed" });
    }

    // Use database transaction for atomic operations
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Delete associated records first
        await Transaction.deleteMany({ user: userId }, { session });
        await Account.deleteMany({ user: userId }, { session });
        
        // Delete the user record
        const deletedUser = await User.findByIdAndDelete(userId, { session });
        
        if (!deletedUser) {
          throw new Error("User not found");
        }
      });

      res.json({ message: "Profile deleted successfully" });
    } catch (transactionError) {
      await session.abortTransaction();
      throw transactionError;
    } finally {
      await session.endSession();
    }

  } catch (error) {
    console.error("Profile deletion error:", error);
    res.status(500).json({ error: "Failed to delete profile" });
  }
};


const userProfileUpdateCrtl = async (req, res, next) => {
  const { password, email } = req.body;
  const userId = req.user._id;

  try {
    // Validate at least one field exists
    if (!password && !email) {
      return res.status(400).json({ msg: "No valid fields to update" });
    }

    // Handle password update
    if (password) {
      // Hash password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await User.findByIdAndUpdate(
        userId,
        { password: hashedPassword },
        { new: true, runValidators: true }
      );
      return res.status(200).json({ msg: "Password updated" });
    }

    // Handle email update
    if (email) {
      await User.findByIdAndUpdate(
        userId,
        { email },
        { new: true, runValidators: true }
      );
      return res.status(200).json({ msg: "Email updated" });
    }
  } catch (error) {
    next(new AppErr(error.message, 500)); // Use 500 for server errors
  }
};

module.exports = {
  userRegistrationCrtl,
  userLoginCrtl,
  userProfileCrtl,
  userProfileDeleteCrtl,
  userProfileUpdateCrtl,
};
