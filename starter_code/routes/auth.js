const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET signup */
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// POST signup
router.post("/signup", (req, res, next) => {
  const { name, email, password } = req.body;

  if (name === "" || email === "" || password === "") {
    res.render("auth/signup", { errorMessage: "Enter all data" });
    return;
  }

  User.findOne({ email }).then(user => {
    if (user !== null) {
      res.render("auth/signup", { errorMessage: "User already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashPass
    });

    newUser.save(err => {
      if (err) {
        res.render("auth/signup", { errorMessage: "Error. Try again" });
        return;
      }
      res.redirect("/");
    });
  });
});

// GET login
router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

// POST login
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: false,
  passReqToCallback: false
}));

// GET logout
router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
})

module.exports = router;
