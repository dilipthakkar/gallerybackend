const Image = require("../models/images");
const fs = require("fs");
const formidable = require("formidable");


exports.uploadfiles = async (req, res) => {
  userId = req.session.user;
  let form = formidable.IncomingForm({ multiples: true });
  form.keepExtensions = true;
  let errors = [];
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }
    const errors = [];
    const files = file.files;
    if(!files){
      return res.json({error : "file empty"});
    }
    if(!files.length){
      const imagedata = fs.readFileSync(files.path);
      const image = new Image({
        name: files.name,
        ImageData: imagedata,
        size: files.size,
        user: userId,
      });
      image.save((err, image) => {
        if (err) {
          errors.push(err);
        }
      });
    }
    for (var i = 0; i < files.length; i++) {
      // console.log(files[i].name);
      const imagedata = fs.readFileSync(files[i].path);
      const image = new Image({
        name: files[i].name,
        ImageData: imagedata,
        size: files[i].size,
        user: userId,
      });
      image.save((err, image) => {
        if (err) {
          errors.push(err);
        }
      });
    }
    return res.json({ error: errors });
  });
};


exports.getFiles = async(req,res)=>{
    const userId = req.session.user
    const images = await Image.find({user : userId}).catch(err=>{error : "Error occured with network"});
    if(images && images.error || !images){
        return res.json({error : "Error occured with network"});
    }
    return res.json({images});
}


exports.getfilebyId = async(req,res)=>{
  const userId = req.session.user;
  const imageId = req.params.imageid;
  const image = await Image.findOne({user : userId , _id : imageId}).catch(err=>{error : err});
  if(!image || (image && image.error) ){
    return res.json({
      error : "Image is not found or some Error occured"
    });
  }
  res.setHeader("Content-Type", "image/jpg");
  res.end(image.ImageData);
}
