const express = require("express");
const router = express.Router();
const User = require("../models/user");
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
router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Enter both email and password to log in.'
    });
    return;
  }

  User.findOne( {email} )
  .then( user => {
    if (!bcrypt.compareSync(password, user.password)) {
      res.render('auth/login', { errorMessage: 'Invalid password.' });
      return;
    }

    req.session.currentUser = user;
    res.redirect('/');
  })
  .catch( err => {
    res.render('auth/login', { errorMessage: err });
    return;
  })
});

// GET logout
router.get("/logout", (req, res, next) => {
  if( !req.session.currentUser ) {
    res.redirect("/");
    return;
  }

  req.session.destroy( (err) => {
    if( err ) {
      next(err);
      return;
    }

    res.redirect("/");
  })
})

module.exports = router;
