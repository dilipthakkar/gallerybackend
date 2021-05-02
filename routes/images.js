const express = require('express');
const router = express();
const { uploadfiles, getFiles, getfilebyId } = require('../controller/images');
const {  islogin , isVerified} = require("../controller/auth");

router.post('/files' , islogin , isVerified , uploadfiles);
router.get('/getfiles' , islogin , isVerified , getFiles);
router.get('/getfile/:imageid' , islogin , isVerified , getfilebyId);

module.exports = router;