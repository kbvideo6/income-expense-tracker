const express = require("express");
const usersRouter = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const  {
  userRegistrationCrtl,
  userLoginCrtl,
  userProfileCrtl,
  userProfileDeleteCrtl,
  userProfileUpdateCrtl,
} = require("../controllers/userController");
//POST/api/v1/users
//register
usersRouter.post("/register",userRegistrationCrtl );

//login
usersRouter.post("/login",userLoginCrtl );

//get profile
usersRouter.get("/profile", authMiddleware , userProfileCrtl );

//delete profile
usersRouter.delete("/profile-delete/", authMiddleware ,userProfileDeleteCrtl );

//update
usersRouter.put("/profile/", authMiddleware , userProfileUpdateCrtl );


module.exports =  usersRouter;