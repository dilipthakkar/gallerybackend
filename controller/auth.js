const User = require("../models/user");
const Email = require("../models/emailVerify");
const sendVerificationMail = require("../controller/email");

const { validationResult } = require("express-validator");


exports.signup = async (req, res) => {
      //validation part
  const error = validationResult(req).array();
  if (error.length > 0) {
    return res.status(200).json({ error: error[0].msg });
  }
//   if(req.contact_no / 2 == NaN) return res.json({error : "phone number should be valid"});

  const user = new User(req.body);
  const checkUser = await User.findOne({ email: req.body.email }).catch((err) =>
    console.log(err)
  );
  if (checkUser) {
    return res.json({ error: "email is already registered" });
  }

  const email = new Email({
    user: user._id,
  });
  const sendMail = await sendVerificationMail(
    user.email,
    user._id,
    email.salt
  ).catch((err) => console.log(err));
  if (sendMail.error) {
    return res.json({ error: "email is invalid or error in network" });
  }

  const saveEmail = await email.save().catch((err) => {
    error: err;
  });
  if (saveEmail.error) return res.json({ error: "error in saving email" });

  const saveUser = await user.save().catch((err) => {
    error: err;
  });
  if (saveUser.error) return res.json({ error: "error in saving user" });
  return res.json({
    auth: false,
    message: "we have sent a verification link to your email",
  });
};

exports.login = async (req, res) => {
    console.log("sessionId",req.session.user);
    console.log('getting it');
    // for validating data
  const error = validationResult(req).array();
  if (error.length > 0) {
    return res.status(400).json({ error: error[0].msg });
  }
  const user = await User.findOne({ email: req.body.email }).catch(err=>{error : err});
  console.log({email : req.body.email});
  console.log(user);
  if(!user){
      return res.json({
        auth: false,
        user: null,
        message: "user is not valid",      
      });
  }

  if (user && user.error) {
    return res.json({
      auth: false,
      user: null,
      message: "user is not valid",
    });
  }
  if(!user.isVerify){
      return res.json({auth : false,user : null})
  }
  if (user.mathcPassword(req.body.password)) {
    user.salt = undefined;
    user.encrypassword = undefined;
    req.session.user = user._id;
    return res.json({
      auth: true,
      user: user,
    });
  } else {
    return res.json({
      auth: false,
      user: null,
      message: "credential not match",
    });
  }
};

exports.logout = async (req, res) => {
  req.session.destroy();
  return res.json({
    auth: false,
    message: "user logout successfully",
  });
};

exports.islogin = async (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.json({
      auth: false,
      user: null,
      message: "user is not logged in",
    });
  }
};

exports.isVerified = async (req, res, next) => {
  const userID = req.session.user;
  User.findById(userID).then((user) => {
    if (user.isVerify) {
      next();
    } else {
      res.json({
        auth: false,
        user: null,
        message: "user is not verify yet",
      });
    }
  });
};

exports.getLoggedinUser = async (req, res, next) => {
  const userId = req.session.user;
  await User.findById(userId)
    .then((result) => {
      result.salt = undefined;
      result.encrypassword = undefined;
      req.body.user = result;
      return res.json({
        auth: true,
        user: result,
      });
    })
    .catch((err) => {
      return res.json({
        auth: false,
        error: err,
        user: null,
        message: "",
      });
    });
};


exports.verifyEmail = async (req, res) => {
  const userId = req.params.userID;
  const encryString = req.params.encry_string;
  const user = await User.findById(userId).catch((err) => {
    error: err;
  });
  if (user && user.error) return res.json({ error: "error in verification" });
  const email = await Email.findOne({ user: user._id }).catch((err) => {
    error: err;
  });
  if (email && email.error) return res.json({error: "error in verification" });
  if (email.salt == encryString) {
    user.isVerify = true;
    const saveUser = await user.save().catch((err) => {
      error: err;
    });
    if (saveUser.error) return res.json({error: "error in verification" });
    return res.json({ auth: true, message: "user is verified" });
  }
  return res.json({ error: "error in verification" });
};


exports.updateinfo = async(req,res)=>{
    const userId = req.session.user;
    const user = await User.findById(userId).catch((err) => {
        error: err;
      });
    if (user && user.error) return res.json({ error: "error in finding user" });
    
    for(const key in req.body){
        user[key] = req.body[key];
    }
    const saveUser = await user.save().catch((err) => {
        error: err;
      });
      if (!saveUser && saveUser.error) return res.json({error: "error in updating info" });
     if(saveUser){
         return res.json({message : "succefully update user data"});
     } 

}

exports.getloginstate = async(req,res)=>{
    if(req.session.user) return res.json({status : true});
    else return res.json({status:false});
}
exports.getverifystate = async(req,res)=>{
    const userID = req.session.user;
  User.findById(userID).then((user) => {
    if (user.isVerify) {
      return res.json({status : true});
    } else {
      res.json({ status : false});
    }
  });
}
