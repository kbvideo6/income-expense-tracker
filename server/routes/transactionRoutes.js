const express = require("express");
const transactionsRouters = express.Router();

const {
  transactionCreateCtrl,
  transactionAcessCtrl,
  allTransactionAcessCtrl,
  transactionDeleteCtrl,
  allTransactionDeleteCtrl,
  editTransactionCtrl,
} = require("../controllers/transactionController");
const authenticateUser = require("../middleware/authMiddleware");

transactionsRouters.post(
  "/transaction",
  authenticateUser,
  transactionCreateCtrl
);

//acess transaction
transactionsRouters.get(
  "/transaction/:id",
  authenticateUser,
  transactionAcessCtrl
);
//all transactions
transactionsRouters.get(
  "/transactions",
  authenticateUser,
  allTransactionAcessCtrl
);
//delete transaction
transactionsRouters.delete(
  "/transaction/:id",
  authenticateUser,
  transactionDeleteCtrl
);
//delete transactions
transactionsRouters.delete(
  "/transactions",
  authenticateUser,
  allTransactionDeleteCtrl
);

//update transaction
transactionsRouters.put(
  "/transaction/:id",
  authenticateUser,
  editTransactionCtrl
);

module.exports = transactionsRouters;
