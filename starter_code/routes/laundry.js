const express = require("express");
const router = express.Router();
const User = require("../models/user");
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");

router.get("/dashboard", ensureLoggedIn("/login"), (req, res, next) => {
  res.render("laundry/dashboard", {user: req.user});
})

router.post("/launderers", ensureLoggedIn("/login"), (req, res, next) => {
  const id = req.user.id;

  const laundererInfo = {
    fee: req.body.fee,
    isLaunderer: true
  };

  User.findByIdAndUpdate( id, laundererInfo)
  .then( () => res.redirect("/dashboard") )
  .catch( err => {
    console.log(err);
    next(err); 
  } );
})

module.exports = router;