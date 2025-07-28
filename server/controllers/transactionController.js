const Account = require("../models/account");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const { AppErr } = require("../utils/appErr");

const transactionCreateCtrl = async (req, res, next) => {
  const {
    title,
    type,
    amount,
    category,
    bankAccount,
    date,
    description,
    tags,
    isRecurring,
  } = req.body;

  try {
    // 1. Get current user
    const currentUserId = req.user._id;
    const userFound = await User.findById(currentUserId);
    if (!userFound) return next(new AppErr("Invalid user", 401));

    // 2. Validate account
    const accountFound = await Account.findById(bankAccount);
    if (!accountFound) return next(new AppErr("Account not found", 404));

    // 3. Create transaction
    const newTransaction = await Transaction.create({
      title,
      type,
      amount,
      category,
      bankAccount,
      user: currentUserId,  // Use authenticated user
      date: date || Date.now(),
      description,
      tags,
      isRecurring,
    });

    // 4. Update account balance
    if (type === "income") {
      accountFound.balance += amount;
    } else {
      accountFound.balance -= amount;
    }

    // 5. Link transaction to account
    accountFound.transactions.push(newTransaction._id);
    await accountFound.save();

    res.status(201).json({
      status: "success",
      data: newTransaction,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};



const transactionAcessCtrl = async (req, res) => {
  try {
    res.json({ msg: "there is  the transaction" });
  } catch (error) {
    res.json({ Error: error });
  }
};
const allTransactionAcessCtrl = async (req, res) => {
  try {
    res.json({ msg: "all transactions" });
  } catch (error) {
    res.json({ Error: error });
  }
};
const transactionDeleteCtrl = async (req, res) => {
  try {
    res.json({ msg: "transaction deleted" });
  } catch (error) {
    res.json({ Error: error });
  }
};
const allTransactionDeleteCtrl = async (req, res) => {
  try {
    res.json({ msg: "transactions deleted" });
  } catch (error) {
    res.json({ Error: error });
  }
};
const editTransactionCtrl = async (req, res) => {
  try {
    res.json({ msg: "transaction edited" });
  } catch (error) {
    res.json({ Error: error });
  }
};

module.exports = {
  transactionCreateCtrl,
  transactionAcessCtrl,
  allTransactionAcessCtrl,
  transactionDeleteCtrl,
  allTransactionDeleteCtrl,
  editTransactionCtrl,
};
