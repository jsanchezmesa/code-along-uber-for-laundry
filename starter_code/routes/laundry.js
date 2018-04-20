const express = require("express");
const router = express.Router();
const User = require("../models/user");
const LaundryPickup = require("../models/laundry-pickup");
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");

router.get("/dashboard", ensureLoggedIn("/login"), (req, res, next) => {
  let query;

  if( req.user.isLaunderer ) {
    query = { launderer: req.user.id };
  } else {
    query = { user: req.user.id };
  }

  LaundryPickup.find(query)
    .populate("user", "name")
    .populate("launderer", "name")
    .sort("pickupDate")
    .then( pickups => res.render("laundry/dashboard") )
    .catch( err => next(err) );
})

router.post("/launderers", ensureLoggedIn("/login"), (req, res, next) => {
  req.user.isLaunderer = true;
  req.user.fee = req.body.fee;
  req.user.save()
  .then(() => res.redirect("/dashboard"))
  .catch(e => next(e))
});

//   const laundererInfo = {
//     fee: req.body.fee,
//     isLaunderer: true
//   };

//   User.findByIdAndUpdate( id, laundererInfo)
//   .then( () => res.redirect("/dashboard") )
//   .catch( err => {
//     console.log(err);
//     next(err); 
//   } );
// })

// router.get("/launderers", (req, res, next) => {
//   User.find( {isLaunderer: true})
//   .then( launderers => res.render("laundry/launderers", {launderers}))
//   .catch( err => {
//     console.log(err);
//     next(err);
//   })
// })

router.get("/launderers/:id", (req, res, next) => {
  const id = req.params.id;

  User.findById(id)
  .then( theLaunderer => res.render("laundry/launderer-profile", {theLaunderer}) )
  .catch( err => {
    console.log(err);
    next(err);
  })
})

router.post("/laundry-pickups", (req, res, next) => {
  const pickupInfo = {
    pickupDate: req.body.pickupDate,
    launderer: req.body.laundererId,
    user: req.user.id
  }

  const newPickup = new LaundryPickup(pickupInfo);

  newPickup.save( (err) => {
    if(err) {
      next(err);
      return;
    }

    res.redirect("/dashboard");
  } );
})

module.exports = router;