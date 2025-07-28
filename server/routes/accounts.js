const express = require("express");
const accountRouters = express.Router();
const accountController = require("../controllers/accountController");
const authMiddleware = require("../middleware/authMiddleware");

accountRouters.post("/account-create",authMiddleware , accountController.createAccount);

//acess account
accountRouters.get("/account/:id",authMiddleware , accountController.getAccount);

//delete account
accountRouters.delete("/account/:id",authMiddleware , accountController.deleteAccount);

//update account
accountRouters.put("/account/:id", authMiddleware , accountController.updateAccount);


module.exports = accountRouters;