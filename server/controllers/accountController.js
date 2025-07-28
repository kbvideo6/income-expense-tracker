const Account = require("../models/account");
const User = require("../models/User");
const { AppErr } = require("../utils/appErr");


// accountController.js

exports.createAccount = async (req, res, next) => {
  // If using authentication middleware, use req.user._id
  const userId = req.user?._id || req.body.user; // fallback to req.body.user if not using middleware
console.log(userId);
  const {
    accountName,
    accountNumber,
    Name,
    accountType,
    balance = 0,
    currency = "LKR",
    description = "",
  } = req.body;

  try {
    // 1. Create the account
    const newAccount = await Account.create({
      accountName,
      accountNumber,
      Name,
      accountType,
      user: userId,
      balance,
      currency: currency.toUpperCase(),
      description,
    });

    // 2. Find the user in the database
    const userFound = await User.findById(userId);
    if (!userFound) {
      return next(new AppErr("User not found", 401));
    }

    // 3. Push the account ID to the user's accounts array
    userFound.Accounts.push(newAccount._id);
    await userFound.save();

    // 4. Respond
    res.status(201).json({
      msg: "Account created",
      newAccount,
      user: userFound,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};


exports.getAccount = async (req, res) => {
  try {
    res.json({ msg: "there is the account" });
  } catch (error) {
    res.json({ Error: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    res.json({ msg: "account deleted" });
  } catch (error) {
    res.json({ Error: error.message });
  }
};

exports.updateAccount = async (req, res) => {
  try {
    res.json({ msg: "account updated" });
  } catch (error) {
    res.json({ Error: error.message });
  }
};
