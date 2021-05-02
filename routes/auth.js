const express = require("express");
const { check } = require("express-validator");
const { signup, login, accessMyData, islogin , logout, verifyEmail,updateinfo, getloginstate, getverifystate, isVerified, getLoggedinUser} = require("../controller/auth");
const router = express.Router();




router.post(
  "/signup",
  [
    check("name")
      .isLength({ min: 3 })
      .withMessage("name should be atleast 3 character long"),
    check('email').isEmail().withMessage("email is empty or invalid") , 
    check("password")
      .isLength({ min: 5 })
      .withMessage("password should be atleast 5 character long"),
      check("address").isLength({min : 8}).withMessage("adddress should be 8 character long"),
      check('contact_no').isLength({min:10,max:10}).withMessage("contact number should be of 10 digits"),
      check("gender").isLength({min:1 ,max:1}).withMessage('gender should specified')
  ],
  signup
);

router.post(
  "/login",
  [
    check("password")
      .isLength({ min: 5 })
      .withMessage("password should be atleast 5 character long"),
    check("email").isEmail().withMessage("email should not be empty or invalid"),
  ],
  login
);

router.post( "/updateinfo",
[
  check("name")
    .isLength({ min: 3 })
    .withMessage("name should be atleast 3 character long"),
  check("password")
    .isLength({ min: 5 })
    .withMessage("password should be atleast 5 character long"),
    check("address").isLength({min : 8}).withMessage("adddress should be 8 character long"),
    check('contact_no').isLength({min:10,max:10}).withMessage("contact number should be of 10 digits"),
    check("gender").isLength({min:1 ,max:1}).withMessage('gender should specified')
],
updateinfo)

router.get('/isloggedin' , islogin);
router.get('/logout' , logout);
router.get('/userprofile' ,islogin ,isVerified, getLoggedinUser);

router.get('/loginstate' , getloginstate);
router.get('/verifystate' , getverifystate);


router.get('/emailverify/:userID/:encry_string' , verifyEmail);
module.exports = router;
