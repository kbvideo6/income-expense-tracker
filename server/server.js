const express = require("express");
const dataBase = require("./config/database");
const app = express();
const gobalErrorHandler = require("./middleware/errorHandler");


//connect DB
dataBase();

//import routers
const usersRouters = require("./routes/userRoutes");
const transactionsRouters = require("./routes/transactionRoutes");
const accountRouters = require("./routes/accounts");
const errorHandler = require("./middleware/errorHandler");


//midleweres
app.use(express.json());

//user routers
//api/v1/accounts
app.use("/api/v1/users", usersRouters);
//transtranction touters
//api/v1/transactions
app.use("/api/v1", transactionsRouters);
//acount routers
app.use("/api/v1", accountRouters);

//error handle
app.use(gobalErrorHandler);

//listn port
const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log("app is running on:", PORT));
